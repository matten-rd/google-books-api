import { Flex, StackDivider, VStack, Heading } from "@chakra-ui/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { useFetch } from "../api/repository";
import { ApiSchema } from "../api/schema";
import { ShelfCardCompact } from "../components/shelfCardCompact";
import * as Routes from "../constants/routes";

interface Props {
  shelfId: string;
  title: string;
}

const BookShelfDetail = ({ match }: RouteComponentProps<Props>) => {
  const token = sessionStorage.getItem("authToken");

  return token ? (
    <BookShelfDetailAuth
      token={token}
      shelfId={match.params.shelfId}
      title={match.params.title}
    />
  ) : (
    <BookShelfDetailNonAuth />
  );
};

const BookShelfDetailNonAuth = () => {
  return <div>Logga in först</div>;
};

interface AuthProps {
  token: string;
  shelfId: string;
  title: string;
}

const BookShelfDetailAuth = ({ token, shelfId, title }: AuthProps) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const { data, loading, error } = useFetch<ApiSchema.RootObject>(
    `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/volumes?key=${API_KEY}&country=SV`,
    token
  );

  const history = useHistory();
  const onNavigateToDetailPage = (id: string | undefined) => {
    let path = Routes.Detail + "/" + id;
    history.push(path);
  };

  if (error) {
    return <div>Error</div>;
  } else if (loading) {
    return <div>Loading...</div>;
  } else {
    if (data.totalItems === 0) {
      return <div>Här var det tomt!</div>;
    } else {
      return (
        <Flex w="full" justifyContent="center">
          <Flex w="full" maxW="7xl" direction="column" p="8">
            <Heading fontSize="2xl">{title}</Heading>
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
                  title={item.volumeInfo?.title}
                  subtitle={item.volumeInfo?.authors?.slice(0, 2)}
                  image={item.volumeInfo?.imageLinks?.thumbnail}
                  onClick={() => onNavigateToDetailPage(item.id)}
                />
              ))}
            </VStack>
          </Flex>
        </Flex>
      );
    }
  }
};

export default BookShelfDetail;
