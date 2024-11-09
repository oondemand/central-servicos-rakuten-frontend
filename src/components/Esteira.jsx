import React from "react";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Etapa from "./Etapa";
import EtapaIntegracaoOmie from "./EtapaIntegracaoOmie";
import { useEtapa } from "../contexts/EtapaContext";

import "../styles/esteira/esteira.css";

const Esteira = () => {
  const { listaEtapas } = useEtapa();

  return (
    <Flex
      justifyContent="center"
      minHeight="calc(100vh - 200px)"
      width="100%"
      margin="0 auto"
    >
      <Swiper
        className="mySwiper"
        navigation={true}
        modules={[Navigation]}
        spaceBetween={16} 
        loop={false}
        grabCursor={true}
        slidesPerView="auto" 
      >
        {listaEtapas.map((etapa, index) => (
          <SwiperSlide
            key={etapa._id}
            style={{ minWidth: "280px", maxWidth: "300px" }}
          >
            <Box width="100%">
              <Etapa etapa={etapa} index={index} />
            </Box>
          </SwiperSlide>
        ))}
        <SwiperSlide style={{ minWidth: "280px", maxWidth: "300px" }}>
          <Box width="100%">
            <EtapaIntegracaoOmie />
          </Box>
        </SwiperSlide>
      </Swiper>
    </Flex>
  );
};

export default Esteira;
