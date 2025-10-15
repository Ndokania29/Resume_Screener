# Smart Resume Screener

A comprehensive AI-powered Applicant Tracking System (ATS) that intelligently screens resumes, matches candidates with job requirements, and provides detailed scoring with justifications.

## Overview

Smart Resume Screener is a full-stack web application designed to streamline the recruitment process by automatically parsing resumes, extracting relevant information, and scoring candidates against job requirements using advanced AI algorithms and keyword matching.

## Key Features

### Core Functionality
- **Intelligent Resume Parsing**: Automatically extracts candidate information from PDF resumes including name, contact details, skills, experience, education, and projects
- **AI-Powered ATS Scoring**: Uses Google Gemini AI for comprehensive resume analysis with intelligent fallback scoring system
- **Job Management**: Create, edit, and manage job postings with detailed requirements and skill specifications
- **Candidate Screening**: Upload and screen multiple candidates against specific job requirements
- **Real-time Analytics**: Dashboard with live statistics and performance metrics

### Multi-Tenant Architecture
- **Company Isolation**: Complete data separation between different companies/organizations
- **Role-Based Access Control**: Support for HR and Admin roles with different permission levels
- **Secure Authentication**: JWT-based authentication with company-specific access controls
- **Scalable Design**: Built to handle multiple organizations on a single platform

### Advanced Analytics Dashboard
- **Real-time Statistics**: Live updates of job postings, applications, average ATS scores, and shortlisted candidates
- **Performance Metrics**: Track recruitment efficiency and candidate quality over time
- **Visual Data Representation**: Clean, responsive charts and graphs for data visualization
- **Filtering and Sorting**: Advanced filtering options for candidates by score ranges and status

### Resume Processing Capabilities
- **PDF Text Extraction**: Robust PDF parsing using industry-standard libraries
- **Structured Data Extraction**: Intelligent parsing of resume sections including:
  - Personal Information (Name, Email, Phone, Location)
  - Professional Experience (Years of experience, job roles)
  - Technical Skills and Competencies
  - Educational Background
  - Projects and Certifications
  - Portfolio Links and Social Profiles

### Intelligent Scoring System
- **AI-Powered Analysis**: Deep semantic analysis using Google Gemini AI
- **Detailed Justifications**: Comprehensive feedback on candidate fit including:
  - Technical skill alignment
  - Experience relevance assessment
  - Educational background evaluation
  - Improvement suggestions
  - Final hiring recommendations

### User Experience Features
- **Responsive Design**: Fully responsive interface optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional interface with dark mode support
- **Intuitive Navigation**: Streamlined workflow from job creation to candidate selection
- **Real-time Updates**: Live data refresh and automatic synchronization
- **Download Capabilities**: PDF resume download functionality with secure access controls

## Technology Stack

### Backend Technologies
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with bcryptjs password hashing
- **File Processing**: Multer for file uploads, pdf-parse for PDF text extraction
- **AI Integration**: Google Generative AI (Gemini) for intelligent resume analysis
- **Environment Management**: dotenv for configuration management

### Frontend Technologies
- **Framework**: React.js (v18+) with functional components and hooks
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router DOM for client-side navigation
- **Styling**: Tailwind CSS for responsive, utility-first styling
- **State Management**: React Context API for global state management
- **HTTP Client**: Custom API utility with JWT authentication

### Development Tools
- **Process Management**: PM2 for production deployment
- **Code Quality**: ESLint for code linting and formatting
- **Version Control**: Git with comprehensive commit history
- **Package Management**: npm with lock files for dependency management

## Architecture Highlights

### Security Features
- **JWT Authentication**: Secure token-based authentication system
- **Password Encryption**: bcryptjs for secure password hashing
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive server-side validation
- **File Upload Security**: Secure file handling with type validation

### Performance Optimizations
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Caching Strategy**: Efficient data caching and state management
- **Lazy Loading**: Component-level code splitting for faster load times
- **Responsive Images**: Optimized asset delivery
- **Minified Builds**: Production-optimized bundle sizes

### Scalability Features
- **Modular Architecture**: Clean separation of concerns with modular components
- **RESTful API Design**: Standard REST endpoints for easy integration
- **Database Optimization**: Efficient data models and query optimization
- **Horizontal Scaling**: Architecture designed for horizontal scaling
- **Load Balancing Ready**: Compatible with load balancers and reverse proxies

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

### Job Management
- `GET /api/jobs` - Retrieve company jobs
- `POST /api/jobs` - Create new job posting
- `DELETE /api/jobs/:id` - Delete job posting

### Resume Processing
- `POST /api/resumes/upload` - Upload and process resume
- `GET /api/resumes/job/:jobId` - Get resumes for specific job
- `GET /api/resumes/download/:id` - Download resume PDF

## Deployment Options

### Production Deployment
- **Traditional VPS**: Complete server setup with PM2 and Nginx
- **Cloud Platforms**: Vercel (frontend) + Railway (backend) deployment
- **Docker Containers**: Full containerization with Docker Compose
- **Database Options**: MongoDB Atlas or self-hosted MongoDB

### Environment Configuration
- **Environment Variables**: Comprehensive configuration management
- **SSL Support**: HTTPS configuration with Let's Encrypt
- **Domain Management**: Custom domain support with proper DNS configuration
- **Monitoring**: Built-in logging and error tracking

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB (local or cloud instance)
- Git for version control

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Smart_Resume_Checker

# Backend setup
cd backend
npm install
cp env.example .env
# Configure your environment variables

# Frontend setup
cd ../frontend
npm install

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Configuration
1. Set up MongoDB connection string
2. Configure JWT secret key
3. Optional: Add Google Gemini API key for AI features
4. Configure CORS settings for production

## Use Cases

### HR Departments
- Streamline resume screening process
- Reduce manual review time by 80%
- Standardize candidate evaluation criteria
- Generate detailed candidate reports

### Recruitment Agencies
- Handle multiple client requirements simultaneously
- Maintain separate data for different clients
- Scale operations with automated screening
- Provide detailed candidate analysis to clients

### Enterprise Organizations
- Integrate with existing HR systems
- Maintain compliance with data privacy regulations
- Support high-volume recruitment drives
- Generate analytics and reporting

## Future Enhancements

### Planned Features
- **Advanced Analytics**: Machine learning insights and trend analysis
- **Integration APIs**: Third-party ATS and HRMS integrations
- **Bulk Processing**: Batch resume processing capabilities
- **Advanced Filtering**: Complex search and filter options
- **Email Notifications**: Automated candidate communication
- **Interview Scheduling**: Integrated calendar and scheduling system

### Technical Improvements
- **Real-time Collaboration**: Multi-user real-time editing
- **Advanced Security**: Two-factor authentication and audit logs
- **Performance Monitoring**: Application performance monitoring and alerting
- **API Rate Limiting**: Advanced rate limiting and throttling
- **Microservices**: Migration to microservices architecture

## Support and Documentation


### Community
- Issue tracking and bug reports
- Feature requests and enhancement suggestions
- Community contributions and pull requests
- Regular updates and maintenance releases

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

We welcome contributions from the community. Please read our contributing guidelines and code of conduct before submitting pull requests.

---

**Smart Resume Screener** - Revolutionizing recruitment through intelligent automation and AI-powered candidate screening.