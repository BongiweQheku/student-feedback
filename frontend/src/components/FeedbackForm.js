import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: 5
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }
    
    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/feedback', formData);
      setMessage('Feedback submitted successfully!');
      setFormData({
        studentName: '',
        courseCode: '',
        comments: '',
        rating: 5
      });
    } catch (error) {
      setMessage('Error submitting feedback. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="feedback-form">
      <h2>Submit Course Feedback</h2>
      
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="studentName" className="form-label">Student Name</label>
          <input
            type="text"
            className={`form-control ${errors.studentName ? 'is-invalid' : ''}`}
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
          />
          {errors.studentName && <div className="invalid-feedback">{errors.studentName}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="courseCode" className="form-label">Course Code</label>
          <input
            type="text"
            className={`form-control ${errors.courseCode ? 'is-invalid' : ''}`}
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
          />
          {errors.courseCode && <div className="invalid-feedback">{errors.courseCode}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="comments" className="form-label">Comments</label>
          <textarea
            className={`form-control ${errors.comments ? 'is-invalid' : ''}`}
            id="comments"
            name="comments"
            rows="3"
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
          {errors.comments && <div className="invalid-feedback">{errors.comments}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating (1-5)</label>
          <select
            className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
          {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;