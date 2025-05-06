def validate_username(username):
    return username and len(username) >= 3

def validate_password(password):
    return password and len(password) >= 6

def generate_response(message, status_code, data=None, error=None):
    response = {
        'message': message,
        'success': 200 <= status_code < 300,
    }
    
    if data is not None:
        response['data'] = data
    
    if error is not None:
        response['error'] = error
        
    return response, status_code