import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Stack, Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";

import { addProducts } from "../../app/slices/inventorySlice";
import { resetMarketplaceInfo } from "../../app/slices/marketSlice";
import { standardGet } from "../../services/standard";
import { RootState } from "../../app/store";

import Header from "../Header/Header";
import ProductCard from "./ProductCard";
import BookmarkedCard from "./BookmarkedCard";
import MarketplacePurchase from "./MarketplacePurchase";
import LinearLoading from "../common/LinearLoading";
import AddNewDevice from "./Add/AddNewDevice";

const Marketplace = () => {
  const productRedux = useSelector(
    (state: RootState) => state.inventory.products
  );

  const client = useSelector((state: RootState) => state.client.data);
  const selectedClient = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const existing_order_info = useSelector(
    (state: RootState) => state.market.order_info
  );

  let marketClient = client === "spokeops" ? selectedClient : client;

  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const [loading, setLoading] = useState(false);
  const [pagenumber, setPagenumber] = useState(0);
  const [product, setProduct] = useState("");
  const [product_type, setProductType] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any>({});
  const [brandname, setBrand] = useState("");
  const [brandtypes, setTypes] = useState<any | null>(null);
  const [openModal, setOpen] = useState(false);
  const [modalimg, setImg] = useState("");

  const [bookmarked, setBookmarked] = useState<any[]>([]);

  const getProducts = async () => {
    setLoading(true);
    if (marketClient) {
      const accessToken = await getAccessTokenSilently();

      const marketplaceRes = await standardGet(
        accessToken,
        "getmarketplaceinventory/" + marketClient
      );
      dispatch(addProducts(marketplaceRes.data));
    }
    setLoading(false);
  };

  useEffect(() => {
    getProducts().catch();
  }, [selectedClient, client]);

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setPagenumber(0);
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (existing_order_info !== null) {
      setOpen(true);
      if (existing_order_info.item_type) {
        setTypes(
          productRedux
            .filter((p) => p.item_type === existing_order_info.item_type)[0]
            .brands.filter((b) => b.brand === existing_order_info.brand)[0]
            .types
        );
      }
    }
  }, [existing_order_info]);

  useEffect(() => {
    let bookmarked_devices: any[] = [];

    productRedux.forEach((p) => {
      if (p.item_type === "Laptops") {
        p.brands.forEach((b) => {
          b.types.forEach((t) => {
            t.specs.forEach((s) => {
              if (s.bookmarked) {
                bookmarked_devices.push({
                  brand: b.brand,
                  type: t.type,
                  spec: s.spec,
                  locations: s.locations,
                  device_type: p.item_type,
                });
              }
            });
          });
        });
      }
    });

    if (bookmarked_devices.length > 0) {
      setBookmarked(bookmarked_devices);
    } else {
      setBookmarked([]);
    }

    if (product !== "" && productRedux.length > 0) {
      const product_index = productRedux.findIndex(
        (p) => p.item_type === product
      );

      if (product_index > -1) {
        setBrands(productRedux[product_index].brands);
      }
    }

    if (brandname !== "" && productRedux.length > 0) {
      const brand_index = productRedux
        .filter((p) => p.item_type === product)[0]
        .brands.findIndex((b) => b.brand === brandname);

      if (brand_index > -1) {
        let updt_brands = productRedux.filter((p) => p.item_type === product)[0]
          .brands[brand_index];
        setTypes(updt_brands.types);
        setImg(updt_brands.imgSrc);
      }
    }
  }, [productRedux]);

  useEffect(() => {}, [bookmarked]);

  const genericProduct = (product_name: string, item_index: number) => {
    setPagenumber(1);
    setProduct(product_name);
    setSelectedProducts([product_name]);
    setBrands(productRedux[item_index].brands);
    setSuppliers(productRedux[item_index].suppliers);
    setProductType(productRedux[item_index].item_type);
  };

  const selectBrand = (brand_name: string, index: number) => {
    // setPagenumber(2);
    setOpen(true);
    setBrand(brand_name);
    setTypes(brands![index].types);
    setImg(brands![index].imgSrc);
  };

  const chipFilter = (text: string) => {
    if (text === "") {
      setSelectedProducts([]);
      setPagenumber(0);
    } else if (selectedProducts.indexOf(text) < 0) {
      setSelectedProducts((prevProds) => [...prevProds, text]);
      setPagenumber(0);
    }
  };

  const searchFilter = (text: string) => {
    const lowerCaseText = text.toLowerCase();
    if (text !== "") {
      let categoryFilter = productRedux.filter(
        (prod) => prod.item_type.toLowerCase().indexOf(lowerCaseText) > -1
      );

      let productFilter = productRedux.filter(
        (prod) =>
          prod.brands.filter(
            (key) => key.brand.toLowerCase().indexOf(lowerCaseText) > -1
          ).length > 0
      );

      if (productFilter.length > 1 || categoryFilter.length > 0) {
        const categoryNames = productFilter.map((prod) => prod.item_type);
        setSelectedProducts(categoryNames);
        setPagenumber(0);
      } else if (productFilter.length > 0) {
        setSelectedProducts([productFilter[0].item_type]);
        setPagenumber(1);
      }
    }
  };

  const chipDelete = (item_type: string) => {
    const prodIndex = selectedProducts.indexOf(item_type);
    if (prodIndex === 0 && selectedProducts.length === 1) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(selectedProducts.splice(prodIndex, 1));
    }
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(resetMarketplaceInfo());
  };
  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          textChange={searchFilter}
          label="Search products and categories"
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>
            <h2>Marketplace</h2>
          </Typography>
          <AddNewDevice client={marketClient} refresh={getProducts} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Chip
            label="All"
            variant={selectedProducts.length === 0 ? "filled" : "outlined"}
            clickable
            onClick={() => chipFilter("")}
          />
          {productRedux &&
            productRedux.length > 0 &&
            productRedux.map((prod, index) => {
              if (!prod.hide)
                return (
                  <Chip
                    label={prod.item_type}
                    clickable
                    variant={
                      selectedProducts.indexOf(prod.item_type) > -1
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() => chipFilter(prod.item_type)}
                    onDelete={
                      selectedProducts.indexOf(prod.item_type) > -1
                        ? () => chipDelete(prod.item_type)
                        : undefined
                    }
                  />
                );
            })}
        </Stack>
        {loading && <LinearLoading />}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingTop: "10px",
          }}
        >
          {pagenumber === 0 &&
            productRedux &&
            productRedux.length > 0 &&
            productRedux.map((product, index) => {
              if (
                (selectedProducts.length !== 0 &&
                  selectedProducts.indexOf(product.item_type) > -1) ||
                (selectedProducts.length === 0 && !product.hide)
              ) {
                return (
                  <ProductCard
                    label={product.item_type}
                    imgSrc={product.imgSrc}
                    index={index}
                    cardAction={genericProduct}
                  />
                );
              }
            })}
          {pagenumber === 1 &&
            brands.length > 0 &&
            brands.map((brand, index) => {
              return (
                <ProductCard
                  label={brand.brand}
                  imgSrc={brand.imgSrc}
                  index={index}
                  cardAction={selectBrand}
                />
              );
            })}
          {existing_order_info === null ? (
            <MarketplacePurchase
              open={openModal}
              handleClose={handleClose}
              imgSrc={modalimg}
              types={brandtypes}
              brand={brandname}
              client={marketClient}
              suppliers={suppliers}
              product_type={product}
              refresh={getProducts}
              item_type={product_type}
            />
          ) : (
            <MarketplacePurchase
              open={openModal}
              handleClose={handleClose}
              types={brandtypes}
              imgSrc={existing_order_info.imgSrc}
              brand={existing_order_info.brand}
              client={existing_order_info.client}
              specific_device={existing_order_info.specific_device}
              location={existing_order_info.location}
              supplier_links={existing_order_info.supplier_links}
              specific_specs={existing_order_info.specific_specs}
              bookmark={existing_order_info.bookmark}
              refresh={getProducts}
              item_type={product_type}
            />
          )}
        </Box>
        {pagenumber === 0 && bookmarked.length > 0 && (
          <Stack pt={2} spacing={2}>
            <Typography component="h3" fontWeight="bold">
              Bookmarked Devices
            </Typography>
            <Stack direction="row" spacing={2}>
              {bookmarked.length > 0 &&
                bookmarked.map((b: any) => {
                  return (
                    <BookmarkedCard
                      device_line={b.type}
                      specs={b.spec}
                      brand={b.brand}
                      locations={b.locations}
                      item_type={b.device_type}
                      client={marketClient}
                      refresh={getProducts}
                    />
                  );
                })}
            </Stack>
          </Stack>
        )}
        {pagenumber > 0 && (
          <Button
            sx={{ marginTop: "50px" }}
            onClick={() => {
              if (pagenumber !== 0) {
                setPagenumber(pagenumber - 1);
                setProduct("");
                setSelectedProducts([]);
              }
            }}
          >
            Back
          </Button>
        )}
      </Box>
    </>
  );
};

export default Marketplace;
