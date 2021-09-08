import { StarIcon } from "@chakra-ui/icons";
import {
  Image,
  Heading,
  Center,
  useColorModeValue,
  Stack,
  Text,
  SimpleGrid,
  Flex,
  Grid,
  GridItem,
  Icon,
  Divider,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { addVolumeToBookShelf, useFetch } from "../api/repository";
import { ApiSchema } from "../api/schema";
import $ from "jquery";
import { ShelfSchema } from "../api/shelfSchema";
import { ShelfCardCompact } from "../components/shelfCardCompact";

interface Props {
  id: string;
}

export default function Detail({ match }: RouteComponentProps<Props>) {
  const { data, loading, error } = useFetch<ApiSchema.Item>(
    `https://www.googleapis.com/books/v1/volumes/${match.params.id}`
  );

  let isbn: string | undefined;
  if (
    data.volumeInfo?.industryIdentifiers !== undefined &&
    data.volumeInfo.industryIdentifiers[1]
  ) {
    isbn = data.volumeInfo.industryIdentifiers[1].identifier;
  } else {
    isbn = "";
  }

  if (error) {
    return <div>Error</div>;
  } else if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <Flex direction="column" alignItems="center" w="full">
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
          columnGap={{ base: "4", lg: "16", xl: "32" }}
          rowGap={{ base: "4", lg: "8", xl: "16" }}
          p={{ base: "0", sm: "0", md: "0", lg: "6", xl: "8" }}
          maxW="7xl"
          w="full"
        >
          <GridItem rowSpan={1}>
            <DetailImage
              imageUrl={data.volumeInfo?.imageLinks?.thumbnail}
              imageAlt={`Image of the book: ${data.volumeInfo?.title}`}
            />
          </GridItem>
          <GridItem rowSpan={1} px={{ base: "8", lg: "0" }}>
            <DetailTitle
              id={data.id}
              title={data.volumeInfo?.title}
              year={data.volumeInfo?.publishedDate}
              authors={data.volumeInfo?.authors}
              rating={data.volumeInfo?.averageRating}
              reviewCount={data.volumeInfo?.ratingsCount}
            />
          </GridItem>
          <GridItem rowSpan={1} px={{ base: "8", lg: "0" }}>
            <DetailAbout
              description={data.volumeInfo?.description}
              isbn={isbn}
              publisher={data.volumeInfo?.publisher}
              date={data.volumeInfo?.publishedDate}
              language={data.volumeInfo?.language}
            />
          </GridItem>
        </Grid>
      </Flex>
    );
  }
}

interface IDetailImage {
  imageUrl?: string;
  imageAlt: string;
}
const DetailImage = ({ imageUrl, imageAlt }: IDetailImage) => (
  <Center
    w="full"
    h={{ base: "sm", sm: "lg", lg: "full" }}
    bg={useColorModeValue("gray.100", "gray.700")}
    rounded={{ lg: "2xl" }}
    paddingX={{ base: "40px", lg: "100px" }}
    paddingY={{ base: "40px", lg: "100px" }}
  >
    <Image
      w={{ lg: "full" }}
      h="full"
      src={imageUrl}
      alt={imageAlt}
      fallbackSrc="https://via.placeholder.com/600x800/FFFFFF/000000?text=Bild+saknas"
      objectFit="contain"
    />
  </Center>
);

interface IDetailAbout {
  description?: string;
  isbn?: string;
  publisher?: string;
  date?: string;
  language?: string;
}
const DetailAbout = ({
  description,
  isbn,
  publisher,
  date,
  language,
}: IDetailAbout) => {
  return (
    <Stack direction="column" pb="10">
      <Heading>Om boken</Heading>
      <Text pb="5">
        {description !== undefined ? $("<div/>").html(description).text() : ""}
      </Text>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        spacing="2"
        bg={useColorModeValue("gray.100", "gray.700")}
        p="4"
        rounded="lg"
      >
        <Stack direction="row">
          <Text fontWeight="bold">ISBN: </Text>
          <Text>{isbn}</Text>
        </Stack>
        <Stack direction="row">
          <Text fontWeight="bold">Förlag: </Text>
          <Text>{publisher}</Text>
        </Stack>
        <Stack direction="row">
          <Text fontWeight="bold">Publiseringsår: </Text>
          <Text>{date?.slice(0, 4)}</Text>
        </Stack>
        <Stack direction="row">
          <Text fontWeight="bold">Språk: </Text>
          <Text>{language}</Text>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
};

interface IDetailTitle {
  title?: string;
  year?: string;
  authors?: string[];
  rating?: number;
  reviewCount?: number;
  id?: string;
}
const DetailTitle = ({
  title,
  year,
  authors,
  rating,
  reviewCount,
  id,
}: IDetailTitle) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const token = sessionStorage.getItem("authToken");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, loading, error } = useFetch<ShelfSchema.RootObject>(
    `https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=${API_KEY}&country=SV`,
    token,
    false
  );

  return (
    <>
      {/* The main content */}
      <Stack direction="column">
        <Text>{year?.slice(0, 4)}</Text>
        <Heading>{title}</Heading>
        <Text>{authors}</Text>
        <Stack direction="row" alignItems="center">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <Icon
                as={StarIcon}
                color={
                  rating ? (i < rating ? "teal.500" : "gray.500") : "gray.500"
                }
              />
            ))}
          <Text>{reviewCount ? reviewCount : 0} Recensioner </Text>
        </Stack>

        <Divider py="4" />

        <SimpleGrid pt="6" columns={{ base: 1, lg: 2 }} w="full" spacing="4">
          <Button
            w="full"
            variant="outline"
            size="lg"
            colorScheme="teal"
            rounded="full"
            disabled={token === null}
            onClick={onOpen}
          >
            Spara i lista
          </Button>
          <Button
            w="full"
            variant="outline"
            size="lg"
            colorScheme="teal"
            rounded="full"
          >
            Förhandsvisa
          </Button>
        </SimpleGrid>
      </Stack>

      {/* The modal content */}
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lägg till i lista</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <VStack
              mt="4"
              divider={<StackDivider />}
              spacing="4"
              align="stretch"
            >
              {data.items?.map((item, idx) => (
                <ShelfCardCompact
                  key={idx}
                  id={item.id}
                  title={item.title}
                  subtitle={`${item.volumeCount} böcker`}
                  onClick={() => {
                    addVolumeToBookShelf(item.id!, id!, token!);
                    onClose();
                  }}
                />
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
