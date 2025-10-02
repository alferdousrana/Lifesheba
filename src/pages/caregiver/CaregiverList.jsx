import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import HoverZoom from "../../pages/components/HoverZoom";

function CaregiverList() {
  const { baseUrl } = config;
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/caregivers/`);
        console.log('API Response (Caregivers):', response.data.results);
        const sortedCaregivers = response.data.results.sort((a, b) => {
          if (a.availability_status === 'AVAILABLE' && b.availability_status === 'BUSY') return -1;
          if (a.availability_status === 'BUSY' && b.availability_status === 'AVAILABLE') return 1;
          return 0;
        });
        setCaregivers(sortedCaregivers);
      } catch (error) {
        console.error('Error fetching caregivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregivers();
  }, [baseUrl]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  if (!caregivers.length) {
    return <div className="text-center mt-5">No caregivers found</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Caregivers</h2>
      <div className="row">
        {caregivers.map((caregiver, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div className="text-center hover-parent">
              <HoverZoom triggerParentHover={true} scale={1.1}>
              <img
                src={
                  caregiver.user?.profile_picture
                    ? caregiver.user.profile_picture   // ✅ Use directly
                    : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                }
                className="card-img-top rounded-circle mx-auto mt-3"
                alt="Caregiver"
                style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px' }}
              />
              </HoverZoom>
              <div className="card-body mt-2">
                <h3>{caregiver.user?.full_name || caregiver.user?.username}</h3>
                <p className="mb-1 text-muted">Education: {caregiver.education}</p>
                <p className="mb-1 text-muted">Training: {caregiver.training}</p>

                <span
                  className={`badge ${caregiver.availability_status === 'AVAILABLE' ? 'bg-success' : 'bg-secondary'} mb-2`}
                >
                  {caregiver.availability_status}
                </span>
              </div>
              <div className="mt-2">
                <button
                  style={{ width: '80%' }}
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/caregivers/${caregiver.slug}`)}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CaregiverList;
