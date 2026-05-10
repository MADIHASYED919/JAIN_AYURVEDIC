# Environment Setup

Create `.env` file inside:

```bash
server/
```

---

# Example

```env
PORT=5000

MONGO_URI=your_mongodb_url

SESSION_SECRET=your_secret

EMAIL_USER=your_email

EMAIL_PASS=your_password

GEMINI_API_KEY=your_key

RAZORPAY_KEY_ID=your_key

RAZORPAY_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_name

CLOUDINARY_API_KEY=your_key

CLOUDINARY_API_SECRET=your_secret
```

---

# Important

- Never upload `.env`
- Keep API keys secret
- Use `.env.example` for GitHub