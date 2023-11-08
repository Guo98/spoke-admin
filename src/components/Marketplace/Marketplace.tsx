import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Chip, Stack, Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { addProducts } from "../../app/slices/inventorySlice";
import { resetMarketplaceInfo } from "../../app/slices/marketSlice";
import { standardGet } from "../../services/standard";
import { RootState } from "../../app/store";
import {
  MarketplaceProducts,
  MarketplaceProducts2,
} from "../../interfaces/inventory";
import Header from "../Header/Header";
import ProductCard from "./ProductCard";
import PurchaseModal from "./PurchaseModal";
import MarketAI from "./AI/MarketAI";
import MarketplacePurchase from "./MarketplacePurchase";
import LinearLoading from "../common/LinearLoading";

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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any>({});
  const [brandname, setBrand] = useState("");
  const [brandtypes, setTypes] = useState<any | null>(null);
  const [openModal, setOpen] = useState(false);
  const [modalimg, setImg] = useState("");

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
    }
  }, [existing_order_info]);

  const genericProduct = (product_name: string, item_index: number) => {
    setPagenumber(1);
    setProduct(product_name);
    setSelectedProducts([product_name]);
    setBrands(productRedux[item_index].brands);
    setSuppliers(productRedux[item_index].suppliers);
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
        <Typography>
          <h2>Marketplace</h2>
        </Typography>
        {loading && <LinearLoading />}
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
          {/* {marketClient !== "public" ? (
            <PurchaseModal
              open={openModal}
              handleClose={handleClose}
              imgSrc={modalimg}
              types={brandtypes}
              brand={brandname}
            />
          ) : (
            <MarketAI
              open={openModal}
              handleClose={handleClose}
              imgSrc={modalimg}
              types={brandtypes}
              brand={brandname}
              client={marketClient}
            />
          )} */}
          {existing_order_info === null ? (
            <MarketplacePurchase
              open={openModal}
              handleClose={handleClose}
              imgSrc={modalimg}
              types={brandtypes}
              brand={brandname}
              client={marketClient}
              suppliers={suppliers}
            />
          ) : (
            <MarketplacePurchase
              open={openModal}
              handleClose={handleClose}
              imgSrc={existing_order_info.imgSrc}
              brand={existing_order_info.brand}
              client={existing_order_info.client}
              specific_device={existing_order_info.specific_device}
              location={existing_order_info.location}
              supplier_links={existing_order_info.supplier_links}
              specific_specs={existing_order_info.specific_specs}
            />
          )}
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
