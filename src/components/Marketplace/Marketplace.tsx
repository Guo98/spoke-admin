import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Chip, Stack, Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { addProducts } from "../../app/slices/inventorySlice";
import { getInventory } from "../../services/inventoryAPI";
import { RootState } from "../../app/store";
import { MarketplaceProducts } from "../../interfaces/inventory";
import Header from "../Header/Header";
import ProductCard from "./ProductCard";
import PurchaseModal from "./PurchaseModal";

const Marketplace = () => {
  const productRedux = useSelector(
    (state: RootState) => state.inventory.products
  );

  const client = useSelector((state: RootState) => state.client.data);
  const selectedClient = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  let marketClient = client === "spokeops" ? selectedClient : client;

  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const [loading, setLoading] = useState(false);
  const [pagenumber, setPagenumber] = useState(0);
  const [product, setProduct] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [brands, setBrands] = useState<MarketplaceProducts["brand"] | null>(
    null
  );
  const [brandname, setBrand] = useState("");
  const [brandtypes, setTypes] = useState<any | null>(null);
  const [openModal, setOpen] = useState(false);
  const [modalimg, setImg] = useState("");

  const getProducts = async () => {
    const accessToken = await getAccessTokenSilently();
    const productRes = await getInventory(accessToken, "Marketplace");
    dispatch(addProducts(productRes.data));
  };

  useEffect(() => {
    if (!loading) {
      getProducts().catch();
      setLoading(true);
    }
  }, [loading]);

  const genericProduct = (product_name: string, item_index: number) => {
    setPagenumber(1);
    setProduct(product_name);
    setSelectedProducts((prevProds) => [...prevProds, product_name]);
    setBrands(productRedux[item_index].brand);
  };

  const selectBrand = (brand_name: string) => {
    // setPagenumber(2);
    setOpen(true);
    setBrand(brand_name);
    setTypes(brands![brand_name].types);
    setImg(brands![brand_name].imgSrc);
  };

  const chipFilter = (text: string) => {
    if (text === "") {
      setSelectedProducts([]);
      setPagenumber(0);
    } else {
      setSelectedProducts((prevProds) => [...prevProds, text]);
      setPagenumber(0);
    }
  };

  const searchFilter = (text: string) => {
    const lowerCaseText = text.toLowerCase();
    if (text !== "") {
      let categoryFilter = productRedux.filter(
        (prod) => prod.id.toLowerCase().indexOf(lowerCaseText) > -1
      );

      let productFilter = productRedux.filter(
        (prod) =>
          Object.keys(prod.brand).filter(
            (key) => key.toLowerCase().indexOf(lowerCaseText) > -1
          ).length > 0
      );

      if (productFilter.length > 1 || categoryFilter.length > 0) {
        const categoryNames = productFilter.map((prod) => prod.id);
        setSelectedProducts(categoryNames);
        setPagenumber(0);
      } else if (productFilter.length > 0) {
        setSelectedProducts([productFilter[0].id]);
        setPagenumber(1);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          textChange={searchFilter}
          label="Search products and categories"
        />
        <Typography>
          <h2>Marketplace</h2>
        </Typography>
        <Stack direction="row" spacing={2}>
          <Chip
            label="All"
            variant={selectedProducts.length === 0 ? "filled" : "outlined"}
            clickable
            onClick={() => chipFilter("")}
          />
          {productRedux.length > 0 &&
            productRedux.map((prod, index) => (
              <Chip
                label={prod.id}
                clickable
                variant={
                  selectedProducts.indexOf(prod.id) > -1 ? "filled" : "outlined"
                }
                onClick={() => chipFilter(prod.id)}
              />
            ))}
        </Stack>
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
            productRedux.length > 0 &&
            productRedux.map((product, index) => {
              if (
                (selectedProducts.length !== 0 &&
                  selectedProducts.indexOf(product.id) > -1) ||
                selectedProducts.length === 0
              ) {
                return (
                  <ProductCard
                    label={product.id}
                    imgSrc={product.imgSrc}
                    index={index}
                    cardAction={genericProduct}
                  />
                );
              }
            })}
          {pagenumber === 1 &&
            brands &&
            Object.keys(brands).map((brand, index) => {
              if (
                brands[brand as keyof {}].clients.indexOf(marketClient) > -1 ||
                brand === "Others"
              ) {
                return (
                  <ProductCard
                    label={brands[brand as keyof {}].name}
                    imgSrc={brands[brand as keyof {}].imgSrc}
                    index={index}
                    cardAction={selectBrand}
                  />
                );
              }
            })}
          <PurchaseModal
            open={openModal}
            handleClose={handleClose}
            imgSrc={modalimg}
            types={brandtypes}
            brand={brandname}
          />
        </Box>
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
