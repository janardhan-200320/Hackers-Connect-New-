from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Allow all origins for development, you can restrict this in production
CORS(app) 

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
# This should be your SERVICE_ROLE_KEY for admin actions like creating users
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in the .env file.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/auth', methods=['POST'])
def auth():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Invalid JSON payload'}), 400

    action = data.get('action')
    email = data.get('email')
    password = data.get('password')

    if not all([action, email, password]):
        return jsonify({'success': False, 'message': 'Missing required fields: action, email, password'}), 400

    if action == 'register':
        username = data.get('username')
        full_name = data.get('fullName')
        try:
            # Use supabase.auth.admin to create users from the backend
            res = supabase.auth.admin.create_user(
                {
                    "email": email,
                    "password": password,
                    "email_confirm": True, # Auto-confirm user for simplicity
                    "user_metadata": {
                        "username": username,
                        "full_name": full_name
                    }
                }
            )
            return jsonify({'success': True, 'message': 'Registration successful.'})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 400

    elif action == 'login':
        try:
            # sign_in_with_password can be called with the public key, but using the service key is fine too
            res = supabase.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": password
                }
            )
            # The official Supabase JWT is in res.session.access_token
            return jsonify({'access_token': res.session.access_token, 'success': True})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 401

    else:
        return jsonify({'success': False, 'message': 'Invalid action specified'}), 400

if __name__ == '__main__':
    # Run on port 5000 to match frontend service calls
    app.run(host='0.0.0.0', port=5000, debug=True)