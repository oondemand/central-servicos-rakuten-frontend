import { useFormikContext } from "formik";

import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import React from "react";

import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";

export const ArquivosPreview = () => {
	// const arquivosDoTicket = await buscarArquivosDoTicket(ticket._id)

	const { values, setFieldValue } = useFormikContext();
	if (values.length === 0) return;
	return (
		<Box my={2}>
			<Text fontSize="lg" fontWeight="bold" mb={2}>
				Arquivos
			</Text>

			{values.arquivos.map((e, i) => {
				const name = e.nomeOriginal ?? e.name;
				const urlDoArquivo =
					`${import.meta.env.VITE_API_URL}/${e.path}` ?? URL.createObjectURL(e);

				return (
					<Flex key={`${e.name} + ${i}`} justify="space-between" align="center">
						<Text>{name}</Text>
						<Flex gap={2} align="center">
							{e._id && (
								<a href={urlDoArquivo} download={name}>
									<IconButton size="xs" colorScheme="green">
										<DownloadIcon />
									</IconButton>
								</a>
							)}

							{!e._id && (
								<IconButton
									size="xs"
									colorScheme="red"
									onClick={() => {
										const files = values.arquivos.filter((file) => {
											return file.name !== e.name;
										});
										setFieldValue("arquivos", files);
									}}
								>
									<DeleteIcon />
								</IconButton>
							)}
						</Flex>
					</Flex>
				);
			})}
		</Box>
	);
};
