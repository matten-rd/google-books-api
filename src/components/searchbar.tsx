import {
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
  Text,
  ResponsiveValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@heroicons/react/outline";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";


interface Inputs {
  query: string;
}

interface Props {
  onSubmit: SubmitHandler<Inputs>;
}

function SearchBar({ onSubmit }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const textColor = useColorModeValue("gray.700", "gray.100");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={SearchIcon} boxSize="6" color="teal.500" mr="3" />}
            h="48px"
          />
          <Input
            id="query"
            variant="unstyled"
            height="48px"
            placeholder="Sök efter böcker..."
            textColor={textColor}
            fontWeight="semibold"
            {...register("query", {
              required: "Sök efter något",
            })}
          />
          <p>{errors.query && errors.query.message}</p>

          <InputRightElement h="48px">
            <Button
              type="submit"
              colorScheme="teal"
              size="sm"
              isLoading={isSubmitting}
              minW="48px"
            >
              Sök
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </form>
  );
}

interface ISearchBarButton {
  onClick: () => void;
  display?: ResponsiveValue<any>;
}

export function SearchBarButton({ onClick, display }: ISearchBarButton) {
  return (
    <Button
      onClick={onClick}
      role="search"
      colorScheme="gray"
      shadow="lg"
      w="full"
      maxW="xl"
      mx="8"
      size="lg"
      justifyContent="flex-start"
      display={display}
    >
      <HStack>
        <Icon as={SearchIcon} mr="2" />
        <Text>Sök efter böcker...</Text>
      </HStack>
    </Button>
  );
}

export default SearchBar;
