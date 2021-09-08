import React from "react";
import {
  Box,
  Image,
  useColorModeValue,
  Flex,
  Link,
  Center,
  Wrap,
  WrapItem,
  Icon,
  AspectRatio,
  Heading,
  VStack,
  IconButton,
  Spacer,
  CircularProgress,
} from "@chakra-ui/react";
import { DotsVerticalIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { useFetch } from "../api/repository";
import { ApiSchema } from "../api/schema";
import { useHistory } from "react-router-dom";
import * as Routes from "../constants/routes";

interface PropsBook {
  title?: string;
  image?: string;
  onClick?: () => void;
}

const BookCardShelf = (props: PropsBook) => {
  const book = {
    imageUrl: props.image,
    imageAlt: `Image of the book: ${props.title}`,
    title: props.title,
  };

  return (
    <VStack w="100px" h="150px" cursor="pointer" onClick={props.onClick}>
      <Center w="full">
        <AspectRatio w="full" ratio={2 / 3}>
          <Image
            rounded="xl"
            src={book.imageUrl}
            alt={book.imageAlt}
            fallbackSrc="https://via.placeholder.com/600x800/FFFFFF/000000?text=Bild+saknas"
            objectFit="contain"
          />
        </AspectRatio>
      </Center>

      <Box>
        <Heading
          fontWeight="normal"
          as="h6"
          fontSize="sm"
          lineHeight="tight"
          noOfLines={1}
        >
          {book.title}
        </Heading>
      </Box>
    </VStack>
  );
};

const PlaceholderCard = () => (
  <Center
    w="100px"
    h="150px"
    borderStyle="dashed"
    borderWidth="2px"
    borderColor={useColorModeValue("gray.300", "gray.600")}
    rounded="xl"
    cursor="pointer"
  >
    <Icon
      as={PlusCircleIcon}
      boxSize="8"
      color={useColorModeValue("gray.300", "gray.600")}
    />
  </Center>
);

interface Props {
  id?: number;
  title?: string;
  access?: string;
  updated?: Date;
  created?: string;
  volumeCount?: number;
  token: string;
  onClick?: () => void;
}

const ShelfCard = ({
  id,
  title,
  access,
  volumeCount,
  token,
  onClick,
}: Props) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const { data, loading, error } = useFetch<ApiSchema.RootObject>(
    `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${id}/volumes?key=${API_KEY}&country=SV`,
    token
  );
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const titleColor = useColorModeValue("gray.700", "white");
  const titleColorHover = useColorModeValue("gray.600", "gray.200");

  const history = useHistory();
  const onNavigateToDetailPage = (id: string | undefined) => {
    let path = Routes.Detail + "/" + id;
    history.push(path);
  };

  if (loading) {
    return (
      <Flex w="full" alignItems="center" justifyContent="center">
        <Box
          mx="auto"
          px="8"
          py="8"
          rounded="xl"
          bg={bgColor}
          maxW="2xl"
          minW="xl"
        >
          <Center w="full" h="full">
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        </Box>
      </Flex>
    );
  } else {
    return (
      <Flex w="full" alignItems="center" justifyContent="center">
        <Box
          mx="auto"
          px="8"
          py="8"
          rounded="xl"
          bg={bgColor}
          maxW="2xl"
          minW="xl"
        >
          <Box mt={2}>
            <Flex>
              <Link
                fontSize="2xl"
                color={titleColor}
                fontWeight="700"
                _hover={{
                  color: titleColorHover,
                  textDecor: "underline",
                }}
              >
                {title} {id} {access === "PRIVATE" ? "Privat" : ""}
              </Link>
              <Spacer />
              <IconButton
                aria-label="More actions"
                variant="ghost"
                rounded="full"
              >
                <Icon as={DotsVerticalIcon} />
              </IconButton>
            </Flex>

            <Box mt={2} pb="4">
              {volumeCount === 0 || volumeCount === undefined ? (
                <PlaceholderCard />
              ) : (
                <Wrap spacing="16px">
                  {data.items?.map((item, idx) => (
                    <WrapItem>
                      <BookCardShelf
                        key={idx}
                        title={item?.volumeInfo?.title}
                        image={item?.volumeInfo?.imageLinks?.thumbnail}
                        onClick={() => onNavigateToDetailPage(item?.id)}
                      />
                    </WrapItem>
                  ))}
                  <WrapItem>
                    <PlaceholderCard />
                  </WrapItem>
                </Wrap>
              )}
            </Box>
          </Box>
        </Box>
      </Flex>
    );
  }
};

export default ShelfCard;
