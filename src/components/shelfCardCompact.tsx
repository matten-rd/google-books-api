import {
  Center,
  Flex,
  Icon,
  Stack,
  useColorModeValue,
  Text,
  Image,
} from "@chakra-ui/react";
import { BookmarkAltIcon } from "@heroicons/react/outline";
import React from "react";

interface Props {
  id?: number | string;
  title?: string;
  subtitle?: string | string[];
  image?: string;
  onClick?: () => void;
}

export const ShelfCardCompact = ({
  id,
  title,
  subtitle,
  image,
  onClick,
}: Props) => {
  return (
    <Flex direction="row" onClick={onClick} cursor="pointer">
      <Center
        boxSize="64px"
        bg={useColorModeValue("gray.100", "gray.700")}
        rounded="lg"
      >
        {image ? (
          <Center
            w="full"
            h="full"
            paddingX="8px"
            paddingY="8px"
          >
            <Image
              h="full"
              src={image}
              fallbackSrc="https://via.placeholder.com/600x800/FFFFFF/000000?text=Bild+saknas"
              objectFit="contain"
            />
          </Center>
        ) : (
          <Icon as={BookmarkAltIcon} boxSize="6" />
        )}
      </Center>
      <Stack direction="column" ml="4">
        <Text>{title}</Text>
        <Text
          fontWeight="semibold"
          textColor={useColorModeValue("gray.400", "gray.500")}
        >
          {subtitle}
        </Text>
      </Stack>
    </Flex>
  );
};
