# Advanced Forms App

A modern form builder application with AI-powered form generation, built with Next.js, Supabase, and Clerk authentication.

## Features

- 🤖 **AI Form Generation**: Create forms from text descriptions or images
- 📱 **14 Advanced Field Types**: Including image selection, signatures, ratings, file uploads
- 👥 **User Authentication**: Secure auth with Clerk
- 📊 **Response Management**: View and manage form responses
- 🗑️ **Form Management**: Create, edit, and delete forms
- 📸 **Image Analysis**: Extract text from images to create forms

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **AI**: OpenAI GPT-3.5-turbo & GPT-4o
- **Deployment**: Netlify

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd forms-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your actual API keys and URLs

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## Deployment to Netlify

### 1. Prepare for Git

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)**
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: `forms-app` (if forms-app is a subdirectory)

### 3. Environment Variables in Netlify

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add all the environment variables from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Netlify domain)

### 4. Update App URLs

After deployment, update these URLs:

**In Clerk Dashboard:**
- Add your Netlify domain to allowed origins
- Update redirect URLs

**In Supabase Dashboard:**
- Add your Netlify domain to allowed origins
- Update authentication settings

**Update `.env.local`:**
```env
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

## Database Setup

The application will automatically create the necessary database tables on first run. The schema includes:

- `forms` - Form definitions
- `form_responses` - User responses
- `form_files` - File uploads
- `user_analytics` - Usage statistics

## Advanced Field Types

- **Text Input** - Standard text fields
- **Email Input** - Email validation
- **Textarea** - Multi-line text
- **Dropdown** - Select options
- **Radio Buttons** - Single choice
- **Checkboxes** - Multiple choice
- **Yes/No** - Boolean choice
- **Number** - Numeric input
- **Date** - Date picker
- **Rating** - Star/heart ratings
- **Slider** - Range input
- **File Upload** - File attachments
- **Image Upload** - Image attachments
- **Image Selection** - Choose from uploaded images
- **Signature** - Digital signatures
- **Location** - GPS coordinates
- **Audio Recording** - Voice recordings
- **Task/Checklist** - Completion tracking
- **Scanner** - QR/Barcode scanning

## AI Features

### Text-to-Form Generation
- Describe your form in natural language
- AI generates 10-15 comprehensive fields
- Intelligent field type selection

### Image-to-Form Generation
- Upload images of existing forms
- **Step 1**: Extract text using GPT-4o vision
- **Step 2**: Analyze extracted text to create digital form
- Supports checklists, tables, and form layouts

## Troubleshooting

### Common Issues

1. **Environment Variables**
   - Ensure all required env vars are set
   - Check for typos in variable names
   - Verify API keys are valid

2. **Database Connection**
   - Check Supabase URL and keys
   - Verify database is accessible

3. **Authentication Issues**
   - Verify Clerk keys and domain settings
   - Check allowed origins in Clerk dashboard

4. **AI Generation Fails**
   - Verify OpenAI API key
   - Check API usage limits
   - Review console logs for detailed errors

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Review the server logs
3. Verify all environment variables are correct
4. Ensure all services (Supabase, Clerk, OpenAI) are properly configured

## License

MIT License - see LICENSE file for details. 