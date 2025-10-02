import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import HoverZoom from "../../pages/components/HoverZoom";

function NurseList() {
  const { baseUrl } = config;
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const response = await axios.get(`${baseUrl}/nurses`);
        const sortedNurses = response.data.results.sort((a, b) => {
          if (a.availability_status === 'AVAILABLE' && b.availability_status === 'BUSY') return -1;
          if (a.availability_status === 'BUSY' && b.availability_status === 'AVAILABLE') return 1;
          return 0;
        });
        setNurses(sortedNurses);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, [baseUrl]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  if (!nurses.length) {
    return <div className="text-center mt-5">No nurses found</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Nurses</h2>
      <div className="row">
        {nurses.map((nurse, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div className="text-center hover-parent">
              <HoverZoom triggerParentHover={true} scale={1.1}>
              <img
                src={
                  nurse.profile?.profile_picture
                    ? `${baseUrl.replace("/api", "")}/${nurse.profile.profile_picture}`
                    : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                }
                className="card-img-top rounded-circle mx-auto mt-3"
                alt="Nurse"
                style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px' }}
              />
              </HoverZoom>
              <div className="card-body mt-3">
                <h3>{nurse.profile?.full_name || `Nurse ${nurse.user?.username}`}</h3>
                <p className="mb-1 text-muted">Experiences: {nurse.experience} Years</p>
                <p className="mb-1 text-muted">Work at: {nurse.work_place}</p>
                
                <span
                  className={`badge ${nurse.availability_status === 'AVAILABLE' ? 'bg-success' : 'bg-secondary'} mb-2`}
                >
                  {nurse.availability_status}
                </span>
              </div>
              <div className="mt-2">
                <button
                style={{width: '80%'}}
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/nurses/${nurse.profile.slug}`)}
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

export default NurseList;