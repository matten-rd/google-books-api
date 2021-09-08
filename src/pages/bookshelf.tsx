import {
  Flex,
  StackDivider,
  VStack,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFetch } from "../api/repository";
import { ShelfSchema } from "../api/shelfSchema";
import { ShelfCardCompact } from "../components/shelfCardCompact";
import * as Routes from "../constants/routes";

const BookShelf = () => {
  const token = sessionStorage.getItem("authToken");

  return token ? <BookShelfAuth token={token} /> : <BookShelfNonAuth />;
};

const BookShelfNonAuth = () => {
  return <div>Logga in först</div>;
};

interface Props {
  token: string;
}

const BookShelfAuth = ({ token }: Props) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const { data, loading, error } = useFetch<ShelfSchema.RootObject>(
    `https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=${API_KEY}&country=SV`,
    token,
    false
  );

  const [myLists, setMyLists] = useState<ShelfSchema.Item[] | undefined>(() =>
    data.items?.filter(checkMyList)
  );

  useEffect(() => {
    const newMyLists = data.items?.filter(checkMyList);
    setMyLists(newMyLists);
  }, [data]);

  const history = useHistory();
  const onNavigateToDetailBookshelfPage = (id: number | undefined, title: string | undefined) => {
    let path = Routes.MyBookShelf + "/" + title + "/" + id;
    history.push(path);
  };

  const headingColor = useColorModeValue("gray.600", "gray.300");

  if (error) {
    return <div>Error</div>;
  } else if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <Flex w="full" justifyContent="center">
        <Flex w="full" maxW="7xl" direction="column" p="8">
          <Heading fontSize="2xl">Mina listor</Heading>
          <VStack mt="4" divider={<StackDivider />} spacing="4" align="stretch">
            {myLists?.map((item, idx) => (
              <ShelfCardCompact
                key={idx}
                id={item.id}
                title={item.title}
                subtitle={`${item.volumeCount} böcker`}
                onClick={() => onNavigateToDetailBookshelfPage(item.id, item.title)}
              />
            ))}
          </VStack>
          <Heading
            mt="8"
            fontSize="lg"
            textColor={headingColor}
          >
            Alla listor
          </Heading>
          <VStack mt="4" divider={<StackDivider />} spacing="4" align="stretch">
            {data.items?.map((item, idx) => (
              <ShelfCardCompact
                key={idx}
                id={item.id}
                title={item.title}
                subtitle={`${item.volumeCount} böcker`}
                onClick={() => onNavigateToDetailBookshelfPage(item.id, item.title)}
              />
            ))}
          </VStack>
        </Flex>
      </Flex>
    );
  }
};

function checkMyList(list?: ShelfSchema.Item) {
  // Checks if the list is created by the user.
  // The Google Books API is structured so that user created lists have an id >= 1000.
  return list?.id !== undefined && list.id >= 1000;
}

export default BookShelf;
