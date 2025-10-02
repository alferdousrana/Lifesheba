import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../../config";
import { GiMicroscope } from "react-icons/gi";

function TestList() {
  const [packages, setPackages] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const navigate = useNavigate();
  const { baseUrl } = config;

  useEffect(() => {
    axios
      .get(`${baseUrl}/labtests/packages/`)
      .then((res) => setPackages(res.data.results || res.data))
      .catch((err) => console.error("Error loading packages:", err));

    axios
      .get(`${baseUrl}/labtests/tests/`)
      .then((res) => setTests(res.data.results || res.data))
      .catch((err) => console.error("Error loading tests:", err));
  }, [baseUrl]);

  const toggleTest = (slug) => {
    setSelectedTests((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  };

  const goToCombinedPage = () => {
    if (selectedTests.length === 0) return;
    navigate(`/tests/combined?slugs=${selectedTests.join(",")}`);
  };

  return (
    <div className="container my-4">
      {/* ---------- Packages Section ---------- */}
      <h3 className="mb-3">Packages</h3>
      <div className="row">
        {Array.isArray(packages) &&
          packages.map((pkg) => (
            <div key={pkg.slug} className="col-md-3 mb-3">
              <div
                className="card shadow-sm p-3 h-100 position-relative"
                style={{ background: "#eaf5f6", cursor: "pointer" }}
                onClick={() => navigate(`/packages/${pkg.slug}`)}
              >
                <h6 className="mb-1" style={{ color: "#08ABBD" }}>
                  {pkg.name}
                </h6>
                <p className="fw-bold" style={{ color: "#A4449D" }}>
                  TK {pkg.price}
                </p>

                {/* ✅ Lab Icon at Bottom Right */}
                <GiMicroscope 
                  size={34}
                  color="#08ABBD"
                  className="position-absolute"
                  style={{ bottom: "10px", right: "10px", opacity: 0.8 }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* ---------- Tests Section ---------- */}
      <h3 className="mt-4 mb-3">Tests</h3>
      <div className="row">
        {[0, 1, 2].map((col) => (
          <div className="col-md-4" key={col}>
            <table className="table table-borderless">
              <tbody>
                {Array.isArray(tests) &&
                  tests
                    .filter((_, index) => index % 3 === col)
                    .map((test) => (
                      <tr key={test.slug}>
                        <td>
                          {/* Checkbox only for selection */}
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={selectedTests.includes(test.slug)}
                            onChange={() => toggleTest(test.slug)}
                            style={{ cursor: "pointer", }}
                          />

                          {/* Name clickable → go to details */}
                          <span
                            style={{ cursor: "pointer", color: "#08ABBD" }}
                            onClick={() => navigate(`/tests/${test.slug}`)}
                          >
                            {test.name}
                          </span>
                        </td>
                        <td className="fw-bold" style={{ color: "#A4449D" }}>
                          TK {test.price}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>


      {/* ---------- Button ---------- */}
      {selectedTests.length > 0 && (
        <div className="text-end mt-3">
          <button className="btn btn-primary" onClick={goToCombinedPage}>
            View Selected Tests ({selectedTests.length})
          </button>
        </div>
      )}
    </div>
  );
}

export default TestList;
