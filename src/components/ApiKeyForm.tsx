import { FormEvent } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  Link,
  Text,
  useColorModeValue,
  VStack,
  CardFooter,
  Button,
  Flex,
} from "@chakra-ui/react";

type ApiKeyFormProps = {
  setApiKey: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function ApiKeyForm({ setApiKey }: ApiKeyFormProps) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const apiKey = data.get("api-key");

    if (typeof apiKey === "string") {
      setApiKey(apiKey.trim());
    }
  };

  return (
    <Center
      h="100%"
      bgGradient={useColorModeValue(
        "linear(to-b, white, gray.100)",
        "linear(to-b, gray.600, gray.700)"
      )}
    >
      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <Heading>&lt;ChatCraft /&gt;</Heading>
            <CardBody>
              <VStack gap={4}>
                <Text fontSize="xl">
                  A combination coding REPL and AI Assistant for better programming.
                </Text>
                <FormControl>
                  <FormLabel>
                    {" "}
                    ChatCraft requires an{" "}
                    <Link
                      href="https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety"
                      textDecoration="underline"
                    >
                      OpenAI API Key
                    </Link>
                  </FormLabel>
                  <Input type="password" name="api-key" required autoFocus />
                  <FormHelperText>
                    Your API Key is stored offline in your browser's{" "}
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">
                      local storage
                    </Link>
                  </FormHelperText>
                </FormControl>
              </VStack>
            </CardBody>
            <CardFooter>
              <Flex w="100%" justify="end">
                <Button type="submit">Save</Button>
              </Flex>
            </CardFooter>
          </CardHeader>
        </form>
      </Card>
    </Center>
  );
}

export default ApiKeyForm;
