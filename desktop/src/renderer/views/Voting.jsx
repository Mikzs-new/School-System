import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

import api from '../api/apiClient';

export default function Voting() {

  const [candidates, setCandidates] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {

      setLoading(true);

      const response = await api.get(
        '/api/v1/election/candidates/'
      );

      setCandidates(response.data || []);

    } catch (error) {

      console.error(error);
      setMessage('Failed to load candidates');

    } finally {

      setLoading(false);

    }
  };

  const handleVote = async (e) => {

    e.preventDefault();

    try {

      setSubmitting(true);
      setMessage('');

      const candidate = candidates.find(
        (c) => String(c.id) === String(selectedCandidate)
      );

      if (!candidate) {

        setMessage('Select a candidate');
        return;

      }

      const enrollmentsResponse = await api.get(
        '/api/v1/student/enroll/'
      );

      const enrollments = enrollmentsResponse.data || [];

      console.log('ENROLLMENTS:', enrollments);

      let enrollment = null;

      enrollment = enrollments.find(
        (e) =>
          String(e.student?.school_student_id) ===
          String(studentId)
      );

      if (!enrollment) {

        enrollment = enrollments.find(
          (e) =>
            String(e.school_student_id) ===
            String(studentId)
        );

      }

      if (!enrollment) {

        enrollment = enrollments.find(
          (e) =>
            String(e.student_id) ===
            String(studentId)
        );

      }

      if (!enrollment) {

        setMessage('Student enrollment not found');
        return;

      }

      const payload = {

        candidate: candidate.id,

        student_enrollment: enrollment.id,

        election:
          candidate.election?.id ||
          candidate.election

      };

      console.log('VOTE PAYLOAD:', payload);

      const response = await api.post(
        '/api/v1/election/vote/',
        payload
      );

      console.log(response.data);

      setMessage('Vote submitted successfully');

      setStudentId('');
      setSelectedCandidate('');

    } catch (error) {

      console.error(error);

      console.log(
        'RESPONSE:',
        error.response
      );

      console.log(
        'DATA:',
        error.response?.data
      );

      setMessage(
        error.response?.data?.detail ||
        JSON.stringify(error.response?.data) ||
        'Failed to submit vote'
      );

    } finally {

      setSubmitting(false);

    }
  };

  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <div className="page-eyebrow">
            ACADEMIC VOTING SYSTEM
          </div>

          <h1>Voting</h1>

        </div>

      </div>

      <form
        className="config-card"
        onSubmit={handleVote}
      >

        <div className="field-group">

          <label>Student ID</label>

          <input
            type="text"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
            placeholder="Enter Student ID"
            required
          />

        </div>

        <div className="field-group">

          <label>Select Candidate</label>

          <div className="candidate-list">

            {loading ? (

              <p>Loading candidates...</p>

            ) : (

              candidates.map((candidate) => (

                <label
                  key={candidate.id}
                  className={
                    String(selectedCandidate) === String(candidate.id)
                      ? 'candidate-card selected'
                      : 'candidate-card'
                  }
                >

                  <input
                    type="radio"
                    value={candidate.id}
                    checked={
                      String(selectedCandidate) ===
                      String(candidate.id)
                    }
                    onChange={() =>
                      setSelectedCandidate(candidate.id)
                    }
                  />

                  <div>

                    <strong>

                      {
                        candidate.student_enrollment?.student ||
                        'Unknown Candidate'
                      }

                    </strong>

                    <p>

                      {
                        candidate.position?.title ||
                        'Position'
                      }

                    </p>

                  </div>

                </label>

              ))
            )}

          </div>

        </div>

        {message && (

          <div className="status-banner">
            {message}
          </div>

        )}

        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
        >

          <CheckCircle2 size={18} />

          {
            submitting
              ? 'Submitting Vote...'
              : 'Submit Vote'
          }

        </button>

      </form>

    </div>

  );
}