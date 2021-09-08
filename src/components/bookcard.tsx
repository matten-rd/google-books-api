import React from "react";
import {
  Box,
  Image,
  Badge,
  Icon,
  AspectRatio,
  VStack,
  Heading,
  Spacer,
  Center,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";

interface Props {
  title?: string;
  authors?: string[];
  image?: string;
  ratingsCount?: number;
  averageRating?: number;
  pageCount?: number;
  publishedYear?: string;
  onClick?: () => void;
}

const BookCard = (props: Props) => {
  const book = {
    imageUrl: props.image,
    imageAlt: "Rear view of modern home with pool",
    pageCount: props.pageCount,
    title: props.title,
    reviewCount: props.ratingsCount ? props.ratingsCount : 0,
    rating: props.averageRating ? props.averageRating : 0,
    authors: props.authors,
    year: props.publishedYear?.slice(0, 4),
  };

  return (
    <Box
      w={{ base: "124px", xs: "164px", sm: "206px" }}
      overflow="hidden"
      onClick={props.onClick}
    >
      <Center
        w="full"
        h={{ base: "196px", xs: "224px", sm: "280px" }}
        bg={useColorModeValue("gray.100", "gray.700")}
        rounded="2xl"
        paddingX={{ base: "18px", xs: "36px", sm: "43px" }}
        paddingY={{ base: "24px", xs: "42px", sm: "49px" }}
      >
        <AspectRatio w="full" ratio={2 / 3}>
          <Image
            src={book.imageUrl}
            alt={book.imageAlt}
            fallbackSrc="https://via.placeholder.com/600x800/FFFFFF/000000?text=Bild+saknas"
            objectFit="contain"
          />
        </AspectRatio>
      </Center>

      <Box p="2">
        <Box d="flex" alignItems="center">
          <Box
            color="gray.400"
            fontWeight="normal"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="capitalize"
            isTruncated={true}
          >
            {book.year}
            {book.year && book.pageCount ? " \u2022 " : ""}
            {book.pageCount ? `${book.pageCount} sidor` : ""}
          </Box>
          <Spacer />
          <IconButton aria-label="More options" size="xs" variant="ghost">
            <Icon as={DotsVerticalIcon} color="gray.400" />
          </IconButton>
        </Box>

        <Heading
          mt="1"
          fontWeight="semibold"
          as="h4"
          fontSize="md"
          lineHeight="tight"
          noOfLines={2}
        >
          {book.title}
        </Heading>

        <VStack spacing="1" align="start">
          {book.authors?.slice(0, 1).map((author) => (
            <Badge px="2" rounded="full" colorScheme="teal" isTruncated={true}>
              {author}
            </Badge>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default BookCard;
