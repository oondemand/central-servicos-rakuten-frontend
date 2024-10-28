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
        spaceBetween={0} 
        loop={false} 
        grabCursor={true} 
        breakpoints={{ 
          640: {
            slidesPerView: 2.3,
          },
          768: {
            slidesPerView: 2.3,
          },
          1024: {
            slidesPerView: 3.1,
          },
          1366: {
            slidesPerView: 3.8,
          },
          1536: {
            slidesPerView: 4.4,
          },
          1920: {
            slidesPerView: 5.3,
          }
        }}
      >
        {listaEtapas.map((etapa, index) => (
          <SwiperSlide key={etapa._id}>
            <Box width="300px">
              <Etapa etapa={etapa} index={index} />
            </Box>
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <Box width="300px">
            <EtapaIntegracaoOmie />
          </Box>
        </SwiperSlide>
      </Swiper>
    </Flex>
  );
};

export default Esteira;
