import os
from flask import Request, jsonify
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import google.auth
import requests


def write_form(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    SPREADSHEET_ID = os.environ.get("SPREADSHEET_ID")
    SHEET_RANGE = os.environ.get("SHEET_RANGE", "Sheet1!A:I")  # adjust columns as needed
    if not SPREADSHEET_ID:
        return jsonify({"error": "Missing SPREADSHEET_ID env var"}), 500

    if request.method != 'POST':
        return 'Method not allowed', 405
    
    # Verify reCAPTCHA
    recaptcha_response = None
    if request.form:
        recaptcha_response = request.form.get("recaptchaResponse")
    else:
        request_json = request.get_json(silent=True) or {}
        recaptcha_response = request_json.get("recaptchaResponse")
    if not recaptcha_response:
        return jsonify({"error": "Missing reCAPTCHA token"}), 400

    secret_key = os.environ.get("RECAPTCHA_SECRET")
    if not secret_key:
        return jsonify({"error": "Missing RECAPTCHA_SECRET env var"}), 500

    verify_resp = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={"secret": secret_key, "response": recaptcha_response}
    )
    verify_result = verify_resp.json()
    if not verify_result.get("success"):
        return jsonify({"error": "reCAPTCHA verification failed"}), 400

    data = request.form.to_dict() if request.form else request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No form data received"}), 400

    row = [
        data.get("timestamp", ""), 
        data.get("firstName", ""), 
        data.get("lastName", ""), 
        data.get("companyName", ""),
        data.get("email", ""),
        data.get("phone", ""),
        data.get("jobTitle", ""),
        data.get("howDidYouHear", "")
    ]
    try:
        # Use default credentials provided to the function
        creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/spreadsheets"])
        service = build("sheets", "v4", credentials=creds)

        # Append the new row
        result = (
            service.spreadsheets()
                   .values()
                   .append(
                        spreadsheetId=SPREADSHEET_ID,
                        range=SHEET_RANGE,
                        valueInputOption="USER_ENTERED",
                        insertDataOption="INSERT_ROWS",
                        body={"values": [row]},
                   )
                   .execute()
        )
        updates = result.get("updates", {})
        return jsonify({
            "status": "success",
            # "updatedRows": updates.get("updatedRows", 0)
            "message": "Your request has been recorded. Our sales team will contact you soon!'"
        }), 200

    except HttpError as err:
        return jsonify({"error": f"An error occurred: {err}"}), 500
