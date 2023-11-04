// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    description: '',
    location: '',
    priority: '',
    status: 'submitted',
  });
  const [updateJob, setUpdateJob] = useState(null);
  const [batchUpdateStatus, setBatchUpdateStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); 

  useEffect(() => {
    // Fetch and display all jobs on component mount
    axios.get('/api/jobs')
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/jobs', newJob)
      .then((response) => {
        setJobs([...jobs, response.data]);
        setNewJob({
          description: '',
          location: '',
          priority: '',
          status: 'submitted',
        });
      })
      .catch((error) => {
        console.error('Error creating job:', error);
      });
  };

  const handleUpdate = () => {
    if (updateJob) {
      axios.put(`/api/jobs/single/${updateJob._id}`, updateJob)
        .then(() => {
          setUpdateJob(null);
          // Fetch and display all jobs after updating
          axios.get('/api/jobs')
            .then((response) => {
              setJobs(response.data);
            })
            .catch((error) => {
              console.error('Error fetching jobs:', error);
            });
        })
        .catch((error) => {
          console.error('Error updating job:', error);
        });
    }
  };

  const handleBatchUpdate = () => {
    if (batchUpdateStatus) {
      const selectedJobIds = jobs
        .filter((job) => job.selected)
        .map((job) => job._id);
  
      axios.put('/api/jobs/batch-update', { // Updated endpoint URL
        jobIds: selectedJobIds,
        status: batchUpdateStatus,
      })
        .then(() => {
          // Fetch and display all jobs after batch update
          axios.get('/api/jobs')
            .then((response) => {
              setJobs(response.data);
            })
            .catch((error) => {
              console.error('Error fetching jobs:', error);
            });
        })
        .catch((error) => {
          console.error('Error updating jobs:', error);
        });
    }
  };

  const handleArchive = (id) => {
    axios.put(`/api/jobs/archive/${id}`)
      .then(() => {
        // Fetch and display all jobs after archiving
        axios.get('/api/jobs')
          .then((response) => {
            setJobs(response.data);
          })
          .catch((error) => {
            console.error('Error fetching jobs:', error);
          });
      })
      .catch((error) => {
        console.error('Error archiving job:', error);
      });
  };

  const handleFilter = () => {
    if (filterStatus) {
      axios.get(`/api/jobs/status/${filterStatus}`)
        .then((response) => {
          setJobs(response.data);
        })
        .catch((error) => {
          console.error('Error fetching jobs:', error);
        });
    }
  };

  return (
    <div className="container">
      <h1>Maintenance Management</h1>
      
      {/* Create form */}
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          />
        </label>
        <label>
          Priority:
          <input
            type="text"
            name="priority"
            value={newJob.priority}
            onChange={(e) => setNewJob({ ...newJob, priority: e.target.value })}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      
      {/* List of jobs */}
      <h2>Jobs</h2>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Description</th>
            <th>Location</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date Submitted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>
                <input
                  type="checkbox"
                  checked={job.selected || false}
                  onChange={() => {
                    setJobs(
                      jobs.map((j) =>
                        j._id === job._id ? { ...j, selected: !j.selected } : j
                      )
                    );
                  }}
                />
              </td>
              <td>
                {updateJob && updateJob._id === job._id ? (
                  <input
                    type="text"
                    value={updateJob.description}
                    onChange={(e) => setUpdateJob({ ...updateJob, description: e.target.value })}
                  />
                ) : (
                  job.description
                )}
              </td>
              <td>
                {updateJob && updateJob._id === job._id ? (
                  <input
                    type="text"
                    value={updateJob.location}
                    onChange={(e) => setUpdateJob({ ...updateJob, location: e.target.value })}
                  />
                ) : (
                  job.location
                )}
              </td>
              <td>
                {updateJob && updateJob._id === job._id ? (
                  <input
                    type="text"
                    value={updateJob.priority}
                    onChange={(e) => setUpdateJob({ ...updateJob, priority: e.target.value })}
                  />
                ) : (
                  job.priority
                )}
              </td>
              <td>
                {updateJob && updateJob._id === job._id ? (
                  <select
                    value={updateJob.status}
                    onChange={(e) => setUpdateJob({ ...updateJob, status: e.target.value })}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  job.status
                )}
              </td>
              <td>{new Date(job.dateSubmitted).toLocaleString()}</td>
              <td>
                {updateJob && updateJob._id === job._id ? (
                  <button onClick={handleUpdate}>Update</button>
                ) : (
                  <button
                    onClick={() => {
                      setUpdateJob(job);
                      setJobs(
                        jobs.map((j) => ({ ...j, selected: false }))
                      );
                    }}
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => handleArchive(job._id)}>Archive</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Batch update form */}
      <h2>Batch Update</h2>
      <label>
        Status:
        <select
          value={batchUpdateStatus}
          onChange={(e) => setBatchUpdateStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="submitted">Submitted</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <button onClick={handleBatchUpdate}>Update Selected</button>
      
      {/* Filter jobs by status */}
      <h2>Filter by Status</h2>
      <label>
        Status:
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="submitted">Submitted</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
}

export default App;
