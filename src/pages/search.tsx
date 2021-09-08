import {
  Box,
  Wrap,
  WrapItem,
  Text,
  Flex,
  useDisclosure,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Button,
  Spacer,
  IconButton,
  Icon,
  ResponsiveValue,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import { ViewGridIcon } from "@heroicons/react/outline";
import React from "react";
import { useHistory } from "react-router-dom";
import { ApiSchema } from "../api/schema";
import BookCard from "../components/bookcard";
import * as Routes from "../constants/routes";

interface ISideBar {
  display?: ResponsiveValue<any>;
}

function FilterSidebar({ display }: ISideBar) {
  return (
    <Flex direction="column" display={display}>
      <Box w="80" h="full">
        Hell
        <Text>Filter</Text>
        <Text>Filter</Text>
        <Text>Filter</Text>
        <Text>Filter</Text>
        <Text>Filter</Text>
        <Text>Filter</Text>
        <Text>Filter</Text>
        <Text>Filter</Text>
      </Box>
    </Flex>
  );
}

interface Props {
  result: ApiSchema.RootObject;
  loading: boolean;
  error: any;
}

function SearchPage({ result, error, loading }: Props) {
  const sidebar = useDisclosure();

  const history = useHistory();
  const onNavigateToDetailPage = (id: string | undefined) => {
    let path = Routes.Detail + "/" + id;
    history.push(path);
  };

  if (error) {
    return <div>Error</div>;
  } else if (loading) {
    return (
      <Center w="full" h="xl">
        <CircularProgress isIndeterminate color="teal.500" />
      </Center>
    );
  } else {
    return (
      <Flex>
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <FilterSidebar />
          </DrawerContent>
        </Drawer>
        <FilterSidebar display={{ base: "none", md: "flex" }} />
        <Flex direction="column" padding={{ base: "8px", sm: "16px" }}>
          <Flex direction="row">
            <Text>Visar resultat för " "</Text>
            <Button
              onClick={sidebar.onOpen}
              display={{ base: "block", md: "none" }}
            >
              Filter
            </Button>
            <Spacer />
            <IconButton
              aria-label="View style"
              rounded="full"
              icon={<Icon as={ViewGridIcon} />}
            />
          </Flex>
          <Wrap
            spacing={{ base: "16px", sm: "24px" }}
            paddingY={{ base: "8px", sm: "16px" }}
            justify="start"
          >
            {result.items?.map((item, idx) => (
              <WrapItem>
                <BookCard
                  key={idx}
                  title={item?.volumeInfo?.title}
                  authors={item?.volumeInfo?.authors}
                  image={item?.volumeInfo?.imageLinks?.thumbnail}
                  averageRating={item?.volumeInfo?.averageRating}
                  ratingsCount={item?.volumeInfo?.ratingsCount}
                  pageCount={item?.volumeInfo?.pageCount}
                  publishedYear={item?.volumeInfo?.publishedDate}
                  onClick={() => onNavigateToDetailPage(item?.id)}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Flex>
      </Flex>
    );
  }
}

export default SearchPage;
