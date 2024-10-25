import React, {useRef} from "react";
import {
	Box,
	Button,
	Input,
} from "@chakra-ui/react";

export const ArquivosImport = () => {
	const inputFileRef = useRef(null);

    return (
        <Box>
        <Button
            onClick={() => inputFileRef.current.click()}
            colorScheme="teal"
            variant="outline"
        >
            Importar Arquivo
        </Button>
        <Input
            type="file"
            ref={inputFileRef}
            onChange={(e) => {
                formik.setFieldValue("arquivos", [
                    ...e.target.files,
                    ...formik.values.arquivos,
                ]);
            }}
            style={{ display: "none" }}
            multiple={true}
            accept=".jpeg, .jpg, .png, .pdf, .xml, .txt"
        />
    </Box>
    )
}