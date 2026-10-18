import React, { useEffect, useState } from "react";
import banner from "./resources/Banner.jpg";
import "./catalog.css";
const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
export default function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [saved, setSaved] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`${API_URL}/products`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            "The catalog is temporarily unavailable. Please try again."
          );
        const data = await response.json();
        if (!Array.isArray(data))
          throw new Error("The catalog returned an unexpected response.");
        setProducts(data);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);
  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ].sort();
  const visible = products.filter(
    (product) =>
      (!category || product.category === category) &&
      `${product.name} ${product.description} ${(product.tags || []).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!showSaved || saved.includes(product._id))
  );
  const toggle = (product) => {
    const exists = saved.includes(product._id);
    setSaved((current) =>
      exists
        ? current.filter((id) => id !== product._id)
        : [...current, product._id]
    );
    setNotice(
      exists
        ? `${product.name} removed from your selection.`
        : `${product.name} saved to your selection.`
    );
  };
  return (
    <div className="shop">
      <header className="shop-nav">
        <a className="shop-logo" href="/">
          buyMore<span>EVERYDAY, CONSIDERED.</span>
        </a>
        <nav aria-label="Main">
          <a href="#catalog">Explore collection</a>
          <button
            aria-pressed={showSaved}
            onClick={() => {
              setShowSaved((value) => !value);
              document.getElementById("catalog")?.scrollIntoView();
            }}
          >
            {showSaved ? "Show all" : `Your selection (${saved.length})`}
          </button>
        </nav>
      </header>
      <main>
        <section
          className="shop-hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(12,38,27,.9), rgba(12,38,27,.15)), url(${banner})`,
          }}
        >
          <div>
            <p className="shop-kicker">THE EVERYDAY EDIT</p>
            <h1>
              Find your
              <br />
              next favourite.
            </h1>
            <p>Explore the collection. Keep the pieces that catch your eye.</p>
            <a href="#catalog">Discover the catalog ↗</a>
          </div>
        </section>
        <section id="catalog" className="shop-catalog">
          <div className="catalog-heading">
            <div>
              <p className="shop-kicker">CURATED BY BUYMORE</p>
              <h2>{showSaved ? "Your selection" : "The collection"}</h2>
            </div>
            <p>Browse. Discover. Save.</p>
          </div>
          <div className="shop-filters">
            <label>
              Search the collection
              <input
                type="search"
                placeholder="Name, description or tag"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label>
              Category
              <select
                aria-label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <button
              onClick={() => {
                setQuery("");
                setCategory("");
                setShowSaved(false);
              }}
            >
              Clear filters
            </button>
          </div>
          <p role="status" className="shop-feedback">
            {notice}
          </p>
          {loading ? (
            <p role="status">Loading the collection…</p>
          ) : error ? (
            <div role="alert">
              <p>{error}</p>
              <button onClick={() => setRetry((value) => value + 1)}>
                Try again
              </button>
            </div>
          ) : !visible.length ? (
            <div className="shop-empty">
              <h3>
                {products.length
                  ? "No pieces match this view."
                  : "A new collection is on its way."}
              </h3>
              <p>
                {products.length
                  ? "Try another search or save a piece from the full collection."
                  : "Check back soon for new arrivals."}
              </p>
            </div>
          ) : (
            <>
              <p className="shop-count">
                {visible.length} {visible.length === 1 ? "piece" : "pieces"}
              </p>
              <div className="shop-grid">
                {visible.map((product) => (
                  <article className="product-card" key={product._id}>
                    <div className="product-image">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="product-detail">
                      <p className="shop-kicker">{product.category}</p>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <small>{product.country}</small>
                      <button
                        aria-pressed={saved.includes(product._id)}
                        onClick={() => toggle(product)}
                      >
                        {saved.includes(product._id)
                          ? "Remove from selection"
                          : "Save to selection"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <footer className="shop-footer">
        <strong>buyMore</strong>
        <p>
          A catalog experience. Selections last for this visit; ordering and
          payment are not available.
        </p>
        <a href="#catalog">Back to collection ↑</a>
      </footer>
    </div>
  );
}
