import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback');
      setFeedback(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching feedback data');
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/${id}`);
        setFeedback(feedback.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback');
      }
    }
  };

  const calculateAverageRating = () => {
    if (feedback.length === 0) return 0;
    const total = feedback.reduce((sum, item) => sum + item.rating, 0);
    return (total / feedback.length).toFixed(1);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard">
      <h2>Feedback Dashboard</h2>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Feedback</h5>
              <h2 className="card-text">{feedback.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Average Rating</h5>
              <h2 className="card-text">{calculateAverageRating()}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="feedback-list">
        <h3>All Feedback</h3>
        {feedback.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">{item.courseCode}</h5>
                  <div>
                    <span className="badge bg-primary">Rating: {item.rating}/5</span>
                    <button 
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <h6 className="card-subtitle mb-2 text-muted">By: {item.studentName}</h6>
                <p className="card-text">{item.comments}</p>
                <small className="text-muted">
                  Submitted on: {new Date(item.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;