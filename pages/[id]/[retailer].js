import styles from "../../styles/Home.module.css";
import gridStyles from "../../styles/Grid.module.css";
import productStyles from "../../styles/Product.module.css";
import retailerProductBoxStyles from "../../styles/RetailerProductBox.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { Accordion } from "flowbite-react";
import Link from "next/link";
import { BsArrowUp } from "react-icons/bs";
import { BsArrowDown } from "react-icons/bs";
import { useState, useEffect } from "react";
import { BiSearch, BiHomeAlt } from "react-icons/bi";
import { BsChevronDoubleRight } from "react-icons/bs";

// function similarity(s1, s2) {
//   var longer = s1;
//   var shorter = s2;
//   if (s1.length < s2.length) {
//     longer = s2;
//     shorter = s1;
//   }
//   var longerLength = longer.length;
//   if (longerLength == 0) {
//     return 1.0;
//   }
//   return (
//     (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
//   );
// }

// function editDistance(s1, s2) {
//   s1 = s1.toLowerCase();
//   s2 = s2.toLowerCase();

//   var costs = new Array();
//   for (var i = 0; i <= s1.length; i++) {
//     var lastValue = i;
//     for (var j = 0; j <= s2.length; j++) {
//       if (i == 0) costs[j] = j;
//       else {
//         if (j > 0) {
//           var newValue = costs[j - 1];
//           if (s1.charAt(i - 1) != s2.charAt(j - 1))
//             newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
//           costs[j - 1] = lastValue;
//           lastValue = newValue;
//         }
//       }
//     }
//     if (i > 0) costs[s2.length] = lastValue;
//   }
//   return costs[s2.length];
// }

export default function Product({ products, error }) {
  const router = useRouter();
  const { id } = router.query;
  const [retailer, setRetailer] = useState(router.query.retailer);
  const [input, setInput] = useState("");
  const [data, setData] = useState(products.filter((o) => { return o.retailer === retailer}));
  const [dataProduct, setDataProduct] = useState(data.find((o) => { return o.product === router.query.product}));
  const [urlChange, setUrlChange] = useState(false);

  useEffect(() => {
    if (router.query.retailer !== retailer)
    {
      setRetailer(router.query.retailer);
      setData(products.filter((o) => { return o.retailer === router.query.retailer}))
    }
    if (urlChange)
    {
      setDataProduct(data.find((o) => { 
        let queryProductName = new URLSearchParams(window.location.search)
        return o.product === queryProductName.get("product")
      }))
      setUrlChange(false);
    }

  }, [urlChange, data, retailer, router])


  const clickRetailer = (product) => {
    window.history.pushState("page2", "Title", `/${router.query.id}/${router.query.retailer}?product=${product}`);
    setUrlChange(true);
  };

  // const setSimilarity = (value) => {
  //   const suggestions = brands.filter((brand) => {
  //     if (!value) return false;
  //     if (similarity(brand.retailer, value) >= 0.7) return true;
  //     if (brand.retailer.toLowerCase().includes(value.toLowerCase()))
  //       return true;
  //     if (value.toLowerCase().includes(brand.retailer.toLowerCase()))
  //       return true;
  //     return false;
  //   });
  //   if (suggestions.length > 0) {
  //     setData(suggestions);
  //   } else {
  //     setData([...brands.slice(0, 4)]);
  //   }
  // };

  const previousRetailer = () => {

  };

  const nextRetailer = () => {
   
  };

  const product = dataProduct;


  return (
    <div>
      <Head>
        <title>WOC Live Score</title>
        <meta name="description" content="WOC live score dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={productStyles.main}>
        {error ? (
          <div className="flex items-center justify-center gap-2 flex-col bg-red-600 text-white p-7 rounded-xl">
            <h1 className="text-3xl">ERROR:</h1>
            <h1>{error}</h1>
            <h2>Probeer later opnieuw</h2>
          </div>
        ) : (
          <div>
            <div className={gridStyles.divRetailerCard}>
              <Link href="/">
                <img
                  className={styles.logo}
                  alt="WoC logo"
                  src="/images/w-logo.png"
                ></img>
              </Link>
              <div className={productStyles.displayCard}>
                <img
                  className={productStyles.retailerLogo}
                  alt="Retailer logo"
                  src="/images/retailer-logo.png"
                />
                <div className={productStyles.displayCardContainer}>
                  <div className={productStyles.displayCardContainerDiv1}>
                    <h5>{product ? product.retailer : null}</h5>
                    <p>{product ? product.score : null}% Similarity</p>
                    <div className={productStyles.progressBarContainer}>
                      <div
                        style={{
                          width: `${product ? product.score : null}%`,
                          backgroundColor:
                            parseInt(product ? product.score : null) >= 50
                              ? parseInt(product ? product.score : null) >= 75
                                ? "#2ecc71"
                                : "#F1C40F"
                              : parseInt(product ? product.score : null) >= 25
                              ? "#E67E22"
                              : "#E74C3C",
                        }}
                        className={retailerProductBoxStyles.progressBarInsert}
                      ></div>
                    </div>
                  </div>
                  <div className={productStyles.displayCardContainerDiv2}>
                    <button
                      className={
                        productStyles.displayCardContainerButtonPrevious
                      }
                      onClick={() => previousRetailer()}
                    >
                      Previous Retailer
                      <BsArrowUp className={productStyles.arrowUpIcon} />
                    </button>
                    <br></br>
                    <button onClick={() => nextRetailer()}>
                      Next Retailer
                      <BsArrowDown className={productStyles.arrowUpIcon} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={productStyles.breadcrumbContainer}>
              <h3>
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
                <BsChevronDoubleRight className={gridStyles.homeLogo} />
                <Link href={`/${id}/${router.query.retailer}`}>
                  <u style={{ cursor: "pointer" }}>{router.query.retailer}</u>
                </Link>
              </h3>
            </div>
            <div className={productStyles.productContainer}>
                <div className={productStyles.productNamesCard}>
                  <div>
                    <h3>Product:</h3>
                  </div>
                  <div
                    className={`${gridStyles.Searchbox} ${productStyles.searchBoxContainer}`}
                  >
                    <input
                      value={input}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          //clickLink(e);
                        }
                      }}
                      onChange={(e) => {
                        setSimilarity(e.target.value);
                        setInput(e.target.value);
                      }}
                      placeholder="Search..."
                      className={gridStyles.Searchbar}
                    />
                    <button
                      //onClick={clickLink}
                      className={gridStyles.SearchButton}
                    >
                      <BiSearch />
                    </button>
                  </div>
                  <div className={productStyles.scrollBar}>

                  </div>
                  {data
                    ? data.map((product) => {
                        return (
                          <div
                            className={productStyles.productNames}
                            key={product._id.$oid}
                          >
                            <button
                              onClick={() =>
                                clickRetailer(
                                  product.product,
                                  data.findIndex((object) => {
                                    return object.product === product.product;
                                  })
                                )
                              }
                            >
                              {product.product}
                            </button>
                          </div>
                        );
                      })
                    : null}
                </div>
                <br></br>
                <div className={productStyles.accordionContainer}>
                  <Accordion
                    alwaysOpen={false}
                    style={{ backgroundColor: "white" }}
                  >
                    {product ? (
                      Object.entries(product.product_brand).map(
                        ([key, value]) => {
                          return (
                            <Accordion.Panel key={key}>
                              <Accordion.Title>
                                <div style={{ display: "flex" }}>
                                  <h3>{key}:</h3>
                                  <p>overeenkomst: ja/nee</p>
                                </div>
                              </Accordion.Title>
                              <Accordion.Content
                                style={{ backgroundColor: "white" }}
                              >
                                <div style={{ display: "flex" }}>
                                  <div>
                                    <h3>Product from WoC</h3>
                                    <br></br>
                                    <h6>Text:</h6>
                                    <br></br>
                                    <p>{value}</p>
                                  </div>
                                  <div>
                                    <h3>Product from retailer</h3>
                                    <br></br>
                                    <h6>Text:</h6>
                                    <br></br>
                                    <p>{product.product_scraped[key].text}</p>
                                  </div>
                                </div>
                              </Accordion.Content>
                            </Accordion.Panel>
                          );
                        }
                      )
                    ) : (
                      <Accordion.Panel>
                        <Accordion.Content>
                          <h1> Error </h1>
                        </Accordion.Content>{" "}
                      </Accordion.Panel>
                    )}
                  </Accordion>
                </div>
              </div>
            </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const url = context.req.headers.host;

  console.log("testa")

  try {
    const res = await fetch(
      `http://${url}/api/product?name=${context.query.id}&retailer=${context.query.retailer}`
    );
    let data = await res.json();

    if (data.status === "error") {
      return {
        props: {
          error: "Data kan niet opgehaald worden",
        },
      };
    } else {
      return {
        props: { products: data.data, error: null },
      };
    }
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
}
