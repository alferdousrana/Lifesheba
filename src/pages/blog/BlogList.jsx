// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { FaPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HoverZoom from "../components/HoverZoom";

function BlogList() {
  const { baseUrl } = config;
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`${baseUrl}/educations/blogs/`),
      axios.get(`${baseUrl}/educations/videos/`),
      axios.get(`${baseUrl}/educations/categories/`),
      axios.get(`${baseUrl}/educations/tags/`),
    ]).then(([blogRes, videoRes, catRes, tagRes]) => {
      const blogData = blogRes.data.results || blogRes.data;
      const videoData = videoRes.data.results || videoRes.data;
      const categoryData = catRes.data.results || catRes.data;
      const tagData = tagRes.data.results || tagRes.data;

      // শুধু published গুলো রাখবো
      const publishedBlogs = blogData.filter((b) => b.status === "published");
      const publishedVideos = videoData.filter((v) => v.status === "published");

      setBlogs(publishedBlogs);
      setVideos(publishedVideos);
      setCategories(categoryData.slice(0, 10)); // প্রথম 10টা ক্যাটাগরি
      setTags(tagData);

      // merge blogs + videos
      const merged = [...publishedBlogs, ...publishedVideos];

      // sort by created_at (newest first)
      merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setAllPosts(merged);
      setFilteredPosts(merged.slice(0, 7));
      setRecentPosts(merged.slice(0, 5));
    });
  }, [baseUrl]);

  // pick top featured (blog or video)
  const featured = [...blogs, ...videos].filter(
    (item) => item.is_featured && item.status === "published"
  );

  // পোস্টে click করলে navigate + views increment
  const handlePostClick = async (post) => {
    try {
      // যদি video_url থাকে তাহলে video, না হলে blog
      const type = post.video_url ? "videos" : "blogs";

      await axios.post(`${baseUrl}/educations/${type}/${post.slug}/increase_views/`);

      navigate(`/blog/${post.slug}`);
    } catch (error) {
      console.error("Error increasing views:", error);
      navigate(`/blog/${post.slug}`);
    }
  };


  // ক্যাটাগরি অনুযায়ী filter
  const handleCategoryClick = (catId) => {
    if (!catId) {
      setFilteredPosts(allPosts); // সব show
    } else {
      setFilteredPosts(allPosts.filter((post) => post.category?.id === catId));
    }
  };

  return (
    <>
      {/* Featured Carousel */}
      {featured.length > 0 && (
        <div
          id="featureCarousel"
          className="carousel slide mb-4"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {featured.map((item, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#featureCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          <div className="carousel-inner">
            {featured.map((item, index) => (
              <div
                key={item.video_url ? `video-${item.id}` : `blog-${item.id}`}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                onClick={() => handlePostClick(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="position-relative">
                  <img
                    src={item.feature_image || item.thumbnail}
                    alt={item.title}
                    className="d-block w-100"
                    style={{ maxHeight: "500px", objectFit: "cover" }}
                  />
                  {"video_url" in item && (
                    <FaPlayCircle
                      size={80}
                      style={{
                        color: "red",
                        background: "white",
                        borderRadius: "50%",
                      }}
                      className="position-absolute top-50 start-50 translate-middle"
                    />
                  )}
                  <div className="position-absolute bottom-0 start-0 p-3 bg-dark bg-opacity-50 text-white w-100">
                    <h2 className="ms-5">{item.title}</h2>
                    {item.excerpt || item.description ? (
                      <p className="ms-5">
                        {item.excerpt
                          ? item.excerpt
                          : item.description.length > 120
                            ? item.description.slice(0, 120) + "..."
                            : item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <div className="row">
          {/* Posts (blogs + videos) */}
          <div className="row col-md-9 g-4">
            {filteredPosts.map((post) => (
              <div
                key={post.video_url ? `video-${post.id}` : `blog-${post.id}`}
                className="col-md-4 mb-4"
                onClick={() => handlePostClick(post)}
                style={{ cursor: "pointer" }}
              >
                <div className="card hover-parent">
                  <div className="position-relative">
                    <HoverZoom scale={1.1} triggerParentHover={true}>
                    <img
                      src={post.feature_image || post.thumbnail}
                      alt={post.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    {"video_url" in post && (
                      <FaPlayCircle
                        size={70}
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{
                          color: "red",
                          background: "white",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                    </HoverZoom>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{post.title.length>25?post.title.slice(0,25)+
                    "...":post.title}</h5>
                    {post.excerpt || post.description ? (
                      <p className="card-text">
                        {(() => {
                          const text = post.excerpt || post.description || "";
                          return text.length > 80 ? text.slice(0, 80) + "..." : text;
                        })()}
                      </p>
                    ) : null}
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn"
                        style={{ backgroundColor: "#08ABBD", color: "#fff" }}
                        onClick={(e) => {
                          e.stopPropagation(); // card click override না হয়
                          handlePostClick(post);
                        }}
                      >
                        Read More
                      </button>
                    </div>
                  </div>

                  <div className="card-footer">
                    <small className="text-muted">
                      {new Date(post.created_at).toLocaleDateString()} |{" "}
                      {post.category?.title} | Views: {post.number_of_reads}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="col-md-3">
            {/* Recent Posts */}
            <h4 className="mb-3" style={{backgroundColor: "#9eeef1ff", padding: "5px", borderRadius: "3px"}}>Recent Posts</h4>
            <ul className="list-unstyled">
              {recentPosts.map((post) => (
                <li
                  key={post.video_url ? `video-${post.id}` : `blog-${post.id}`}
                  className="mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePostClick(post)}
                >
                  <strong>{post.title}</strong>
                </li>
              ))}
            </ul>

            {/* Categories */}
            <h4 className="mt-4 mb-3" style={{ backgroundColor: "#9eeef1ff", padding: "5px", borderRadius: "3px" }}>Categories</h4>
            <table className="table table-bordered table-sm">
              <tbody>
                <tr>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCategoryClick(null)}
                  >
                    All
                  </td>
                </tr>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      {cat.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tags */}
            <h4 className="mt-4 mb-3" style={{ backgroundColor: "#9eeef1ff", padding: "5px", borderRadius: "3px" }}>Tags</h4>
            <div>
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="badge me-1 mb-1"
                  style={{ backgroundColor: "#9a3293ff" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogList;
