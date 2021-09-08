import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import {
  HomeIcon,
  BookOpenIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
  CogIcon,
} from "@heroicons/react/outline";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { Link, useLocation } from "react-router-dom";
import * as Routes from "../constants/routes";
import Login from "../auth/login";
import { useLoggedInStatus } from "../auth/session";
import Logout from "../auth/logout";
import { SearchBarButton } from "../components/searchbar";

interface INavItem {
  route: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  name: string;
}

const NavItem = ({ icon, route, name }: INavItem) => {
  const { pathname } = useLocation();
  const unselectedColor = useColorModeValue("blackAlpha.700", "whiteAlpha.700");
  const selectedColor = useColorModeValue("teal.600", "teal.300");
  const selectedBg = useColorModeValue("teal.50", "teal.700");

  return (
    <Link to={route}>
      <HStack
        px="4"
        mx="2"
        rounded="md"
        spacing="4"
        py="3"
        cursor="pointer"
        color={pathname === route ? selectedColor : unselectedColor}
        bg={pathname === route ? selectedBg : ""}
        _hover={{
          bg: useColorModeValue("gray.50", "gray.800"),
          color: useColorModeValue("gray.700", "gray.100"),
        }}
        fontWeight="semibold"
        transition=".15s ease"
        minW="max-content"
      >
        <Icon boxSize="5" as={icon} />
        <Text as="span" display="inline-block" noOfLines={1}>
          {name}
        </Text>
      </HStack>
    </Link>
  );
};

interface ITopBar {
  onOpenMenu: () => void;
  childComp?: React.ReactNode;
}

export const TopBar = ({ onOpenMenu, childComp }: ITopBar) => {
  const [user, setIsLoggedIn] = useLoggedInStatus();
  const color = useColorModeValue("ffffff", "000000");

  const { isOpen, onOpen, onClose } = useDisclosure();

  let image;
  if (user != null) {
    image = user.imageUrl;
  } else {
    image = `https://avatars.dicebear.com/api/bottts/.svg?b=%23${color}&colors[]=teal`;
  }

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px="4"
      py="4"
      bg={useColorModeValue("white", "gray.800")}
      borderBottomWidth="1px"
      borderColor="blackAlpha.300"
      h="20"
    >
      <IconButton
        aria-label="Search"
        onClick={onOpen}
        icon={<Icon as={SearchIcon} />}
        display={{ base: "inline-flex", md: "none" }}
      />
      <Flex
        direction="row"
        as="nav"
        fontSize="sm"
        aria-label="Main Navigation"
        display={{ base: "none", md: "inline-flex" }}
      >
        <NavItem route={Routes.Home} icon={HomeIcon} name="Hem" />

        <NavItem
          route={Routes.MyBookShelf}
          icon={BookOpenIcon}
          name="Min bokhylla"
        />
      </Flex>
      <SearchBarButton
        onClick={onOpen}
        display={{ base: "none", md: "inline-flex" }}
      />

      <Flex align="center">
        {user != null ? (
          <Menu placement="bottom-end">
            <MenuButton>
              <IconButton
                aria-label="Profile"
                rounded="full"
                icon={
                  <Avatar
                    size="sm"
                    name="anubra266"
                    src={image}
                    cursor="pointer"
                  />
                }
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<Icon as={CogIcon} boxSize="5" />}>
                Inställningar
              </MenuItem>
              <MenuDivider />
              <MenuItem>
                <Logout setIsLoggedIn={(e) => setIsLoggedIn(e)} />
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Login setIsLoggedIn={() => setIsLoggedIn(true)} />
        )}
        <ColorModeSwitcher mr="2" />
        <IconButton
          aria-label="Menu"
          display={{ base: "inline-flex", md: "none" }}
          onClick={onOpenMenu}
          icon={<Icon as={MenuIcon} />}
        />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>{childComp}</ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

interface ISidebarContent {
  width?: string;
  borderRight?: string;
  display?: {
    base?: string;
    md?: string;
  };
  onClose?: () => void;
}

export const SidebarContent = (props: ISidebarContent) => (
  <Box
    as="nav"
    pos="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    h="full"
    pb="10"
    overflowX="hidden"
    overflowY="auto"
    borderColor="blackAlpha.300"
    bg={useColorModeValue("white", "gray.700")}
    borderRightWidth="1px"
    w="60"
    {...props}
  >
    <Flex px="4" py="5" align="center">
      <Text
        fontSize="2xl"
        ml="2"
        color={useColorModeValue("gray.900", "white")}
        fontWeight="semibold"
      >
        App name
      </Text>
      <Spacer />
      <IconButton
        aria-label="close drawer"
        display={{ base: "inline-flex", md: "none" }}
        onClick={props.onClose}
        icon={<Icon as={XIcon} />}
        size="sm"
      />
    </Flex>
    <Flex
      direction="column"
      as="nav"
      fontSize="sm"
      aria-label="Main Navigation"
    >
      <NavItem route={Routes.Home} icon={HomeIcon} name="Hem" />
      <NavItem
        route={Routes.MyBookShelf}
        icon={BookOpenIcon}
        name="Min bokhylla"
      />
    </Flex>
  </Box>
);
