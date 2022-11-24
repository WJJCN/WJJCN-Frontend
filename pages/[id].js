import Head from "next/head";
import styles from "../styles/Home.module.css";
import gridStyles from "../styles/Grid.module.css";
import cardStyles from "../styles/RetailerProductBox.module.css";

import { Card } from "flowbite-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { BiSearch, BiHomeAlt } from "react-icons/bi";
import { BsChevronDoubleRight } from "react-icons/bs";
import Link from "next/link";

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export default function Home({ brands, error, errorStateServer }) {
  console.log(brands);
  const router = useRouter();
  const { id } = router.query;

  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPageLoad(true);
    }, 10);
  }, []);

  const pages = brands ? Math.ceil(brands.length / 4 - 1) : null;
  const [pageNumber, setPageNumber] = useState(0);

  const [data, setData] = useState(brands);

  const setSimilarity = (value) => {
    const suggestions = brands.filter((brand) => {
      if (!value) return false;
      if (similarity(brand.retailer, value) >= 0.7) return true;
      if (brand.retailer.toLowerCase().includes(value.toLowerCase()))
        return true;
      if (value.toLowerCase().includes(brand.retailer.toLowerCase()))
        return true;
      return false;
    });
    if (suggestions.length > 0) {
      setData(suggestions);
    } else {
      setData([...brands.slice(0, 4)]);
    }
  };

  const [input, setInput] = useState("");

  const [getError, setError] = useState(error);
  const [errorState, setErrorState] = useState(errorStateServer);

  const clickLink = (e) => {
    console.log(input);
  };

  const setPage = (page) => {
    const start = page * 4;
    const end = start + 4;
    setData(brands.slice(start, end));
    setPageNumber(page);
  };

  return (
    <div>
      <Head>
        <title>WOC Live Score</title>
        <meta name="description" content="WOC live score dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={pageLoad ? gridStyles.main : gridStyles.Fadein}>
        {getError ? (
          <div style={{ marginTop: "50px" }} className={styles.error}>
            <h1>{errorState}</h1>
          </div>
        ) : (
          <div className={gridStyles.parent}>
            <div className={gridStyles.div1}>
              <Link style={{ cursor: "pointer" }} href={"/"}>
                <img
                  style={{ cursor: "pointer" }}
                  className={styles.logo}
                  alt="world of content logo"
                  src="/images/w-logo.png"
                />
              </Link>
              <h3 className={gridStyles.breadcrums}>
                <Link href="/" className={gridStyles.Link}>
                  <BiHomeAlt
                    style={{ cursor: "pointer" }}
                    className={gridStyles.homeLogo}
                  />
                </Link>
                <BsChevronDoubleRight className={gridStyles.homeLogo} />
                <Link href={`/${id}`}>
                  <u style={{ cursor: "pointer" }}>{id}</u>
                </Link>
              </h3>
              <div className={gridStyles.Searchbox}>
                <input
                  value={input}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      clickLink(e);
                    }
                  }}
                  onChange={(e) => {
                    setSimilarity(e.target.value);
                    setInput(e.target.value);
                  }}
                  placeholder="Search a retailer...."
                  className={gridStyles.Searchbar}
                />
                <button onClick={clickLink} className={gridStyles.SearchButton}>
                  <BiSearch />
                </button>
              </div>
            </div>
            <div className={gridStyles.div2}>
              {data.map((brand) => {
                return (
                  <div
                    key={brand.retailer}
                    style={data.length == 1 ? { width: "50%" } : {}}
                    className={cardStyles.displayCard}
                  >
                    <a href={`/${id}/${brand.retailers}`}>
                      <h2 className={cardStyles.retailertitle}>
                        {brand.retailer}
                      </h2>
                    </a>
                    <div className={cardStyles.productenBox}>
                      {brand.products.map((product) => {
                        return (
                          <div
                            key={product.name}
                            className={cardStyles.productBox}
                          >
                            <a
                              href={`/${id}/${brand.retailer}?product=${product.name}`}
                            >
                              <h4 className={cardStyles.productName}>
                                {product.name}
                              </h4>
                            </a>
                            <p className={cardStyles.scoreName}>
                              {product.score}% Similarity
                            </p>
                            <div className={cardStyles.progressBar}>
                              <div
                                style={{
                                  width: `${product.score}%`,
                                  backgroundColor:
                                    parseInt(product.score) >= 50
                                      ? parseInt(product.score) >= 75
                                        ? "#2ecc71"
                                        : "#F1C40F"
                                      : parseInt(product.score) >= 25
                                      ? "#E67E22"
                                      : "#E74C3C",
                                }}
                                className={cardStyles.progressBarInsert}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={gridStyles.div3}>
              {pageNumber >= 1 ? (
                <button
                  onClick={() => setPage(pageNumber - 1)}
                  className={gridStyles.pageCircleDiv}
                >
                  {"<"}
                </button>
              ) : null}

              <div className={gridStyles.activePageCircleDiv}>
                {pageNumber + 1}
              </div>
              {pageNumber < pages ? (
                <button
                  onClick={() => setPage(pageNumber + 1)}
                  className={gridStyles.pageCircleDiv}
                >
                  {">"}
                </button>
              ) : null}
            </div>
          </div>
        )}

        <div
          className={styles.errorBox}
          style={errorState ? { display: "block" } : { display: "none" }}
        >
          <h3>Error: {getError}</h3>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const url = context.req.headers.host;
  try {
    const res = await fetch(
      `http://${url}/api/retailerbybrand?name=${context.query.id}`
    );
    const data = await res.json();

    if (data.data.errorMessage) {
      return {
        props: {
          error: data.data.errorMessage,
          errorStateServer: true,
        },
      };
    } else {
      if (data.data.length == 0) {
        return {
          props: {
            error: "Geen brand gevonden",
            errorStateServer: true,
          },
        };
      } else {
        return {
          props: { brands: data.data, error: null, errorStateServer: false },
        };
      }
    }
  } catch (error) {
    return {
      error: error,
      errorStateServer: true,
    };
  }
}
