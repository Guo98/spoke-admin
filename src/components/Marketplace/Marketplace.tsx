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

  const searchFilter = (text: string) => {
    if (text === "") {
      setSelectedProducts([]);
    } else {
      setSelectedProducts((prevProds) => [...prevProds, text]);
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
            onClick={() => searchFilter("")}
          />
          {productRedux.length > 0 &&
            productRedux.map((prod, index) => (
              <Chip
                label={prod.id}
                clickable
                variant={
                  selectedProducts.indexOf(prod.id) > -1 ? "filled" : "outlined"
                }
                onClick={() => searchFilter(prod.id)}
              />
            ))}
        </Stack>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {pagenumber === 0 &&
            productRedux.length > 0 &&
            productRedux.map((product, index) => (
              <ProductCard
                label={product.id}
                imgSrc={product.imgSrc}
                index={index}
                cardAction={genericProduct}
              />
            ))}
          {pagenumber === 1 &&
            brands &&
            Object.keys(brands).map((brand, index) => {
              return (
                <ProductCard
                  label={brands[brand as keyof {}].name}
                  imgSrc={brands[brand as keyof {}].imgSrc}
                  index={index}
                  cardAction={selectBrand}
                />
              );
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
            onClick={() => {
              if (pagenumber !== 0) {
                setPagenumber(pagenumber - 1);
                setProduct("");
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
