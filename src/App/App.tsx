import * as React from "react";
import {
  Box,
  ChakraProvider,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import * as Routes from "../constants/routes";
import BookShelf from "../pages/bookshelf";
import { SidebarContent, TopBar } from "../navigation/navigation";
import SearchPage from "../pages/search";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { ApiSchema } from "../api/schema";
import SearchBar from "../components/searchbar";
import { useFetch } from "../api/repository";
import { theme } from "../theme/theme";
import HomePage from "../pages/home";
import Detail from "../pages/detail";
import BookShelfDetail from "../pages/bookshelfDetail";

export const App = () => {
  const sidebar = useDisclosure();

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="right"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <SidebarContent
              width="full"
              borderRight="none"
              onClose={sidebar.onClose}
            />
          </DrawerContent>
        </Drawer>

        <Content onSidebarOpen={sidebar.onOpen} />
      </Router>
    </ChakraProvider>
  );
};

interface IContent {
  onSidebarOpen: () => void;
}
interface SearchProps {
  query: string;
}

export function Content({ onSidebarOpen }: IContent) {
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const [query, setQuery] = useState("a");
  const searchQuery = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&key=${API_KEY}`;

  const { data, loading, error } = useFetch<ApiSchema.RootObject>(searchQuery);
  const history = useHistory();

  const onSubmit: SubmitHandler<SearchProps> = ({ query }) => {
    setQuery(query);
    history.push(Routes.Search);
  };
  return (
    <Box transition=".3s ease">
      <TopBar
        onOpenMenu={onSidebarOpen}
        childComp={<SearchBar onSubmit={onSubmit} />}
      />

      <Box as="main">
        <Route exact path={Routes.Home} component={HomePage} />
        <Route
          path={Routes.Search}
          render={(props) => (
            <SearchPage
              {...props}
              loading={loading}
              error={error}
              result={data}
            />
          )}
        />
        <Route exact path={Routes.MyBookShelf} component={BookShelf} />
        <Route
          exact
          path={Routes.MyBookShelf + "/:title/:shelfId"}
          component={BookShelfDetail}
        />
        <Route exact path={Routes.Detail + "/:id"} component={Detail} />
      </Box>
    </Box>
  );
}
