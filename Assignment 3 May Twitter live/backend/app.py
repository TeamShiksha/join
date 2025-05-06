import os
from dotenv import load_dotenv
from web_app import create_app
from config import Config

# Load environment variables from .env file
load_dotenv()

# Create Flask application
app = create_app(Config)

if __name__ == '__main__':
    # Run the app in debug mode when executed directly
    app.run(debug=True)

