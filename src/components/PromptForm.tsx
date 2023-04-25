import { FormEvent, KeyboardEvent, useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  IconButton,
  Kbd,
  Text,
  Textarea,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { CgChevronUpO, CgChevronDownO, CgInfo } from "react-icons/cg";

import { AutoResizingTextarea } from "./AutoResizingTextarea";
import { useSettings } from "../hooks/use-settings";
import { isMac, isWindows } from "../utils";

type KeyboardHintProps = {
  isVisible: boolean;
};

function KeyboardHint({ isVisible }: KeyboardHintProps) {
  const { settings } = useSettings();

  if (!isVisible) {
    return <span />;
  }

  const metaKey = isMac() ? "Command ⌘" : "Ctrl";

  return (
    <Text ml={2} fontSize="sm">
      <span>
        {settings.enterBehaviour === "send" ? (
          <span>
            <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> for newline
          </span>
        ) : (
          <span>
            <Kbd>{metaKey}</Kbd> + <Kbd>Enter</Kbd> to send
          </span>
        )}
      </span>
    </Text>
  );
}

type PromptFormProps = {
  onPrompt: (prompt: string) => void;
  onClear: () => void;
  // Whether or not to automatically manage the height of the prompt.
  // When `isExpanded` is `false`, Shit+Enter adds rows. Otherwise,
  // the height is determined automatically by the parent.
  isExpanded: boolean;
  toggleExpanded: () => void;
  singleMessageMode: boolean;
  onSingleMessageModeChange: (value: boolean) => void;
  isLoading: boolean;
};

function PromptForm({
  onPrompt,
  onClear,
  isExpanded,
  toggleExpanded,
  singleMessageMode,
  onSingleMessageModeChange,
  isLoading,
}: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const { settings, setSettings } = useSettings();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clear the form when loading finishes and focus the textarea again
  useEffect(() => {
    if (!isLoading) {
      setPrompt("");
      textareaRef.current?.focus();
    }
  }, [isLoading, textareaRef]);

  // Handle prompt form submission
  const handlePromptSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = prompt.trim();
    if (!value.length) {
      return;
    }

    onPrompt(value);
  };

  // Handle API key form submission
  const handleApiKeySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const apiKey = data.get("api-key");

    if (typeof apiKey === "string") {
      setSettings({ ...settings, apiKey: apiKey.trim() });
    }
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    // Deal with Enter key based on user preference
    if (settings.enterBehaviour === "newline") {
      if ((isMac() && e.metaKey) || (isWindows() && e.ctrlKey)) {
        handlePromptSubmit(e);
      }
    } else if (settings.enterBehaviour === "send") {
      if (!e.shiftKey && prompt.length) {
        handlePromptSubmit(e);
      }
    }
  };

  return (
    <Box h="100%" px={1}>
      <Flex justify="space-between" alignItems="baseline">
        <KeyboardHint isVisible={!!prompt.length} />

        <ButtonGroup isAttached>
          <IconButton
            aria-label={isExpanded ? "Minimize prompt area" : "Maximize prompt area"}
            title={isExpanded ? "Minimize prompt area" : "Maximize prompt area"}
            icon={isExpanded ? <CgChevronDownO /> : <CgChevronUpO />}
            variant="ghost"
            onClick={toggleExpanded}
          />
        </ButtonGroup>
      </Flex>

      {/* If we have an API Key in storage, show the chat form;
          otherwise give the user a form to enter their API key. */}
      {settings.apiKey ? (
        <chakra.form onSubmit={handlePromptSubmit} h="100%" pb={2}>
          <Flex pb={isExpanded ? 8 : 0} flexDir="column" h="100%">
            <Box flex={isExpanded ? "1" : undefined} mt={2} pb={2}>
              {isExpanded ? (
                <Textarea
                  ref={textareaRef}
                  h="100%"
                  resize="none"
                  disabled={isLoading}
                  onKeyDown={handleEnter}
                  autoFocus={true}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  bg={useColorModeValue("white", "gray.700")}
                  placeholder="Type your question"
                />
              ) : (
                <AutoResizingTextarea
                  ref={textareaRef}
                  onKeyDown={handleEnter}
                  autoFocus={true}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  bg={useColorModeValue("white", "gray.700")}
                  placeholder="Type your question"
                />
              )}
            </Box>

            <Flex gap={1} justify={"space-between"} align="center">
              <Checkbox
                isDisabled={isLoading}
                checked={singleMessageMode}
                onChange={(e) => onSingleMessageModeChange(e.target.checked)}
              >
                Single Message Mode
              </Checkbox>
              <ButtonGroup>
                <Button onClick={onClear} variant="outline" size="sm">
                  Clear Chat
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isDisabled={isLoading || !prompt.length}
                  isLoading={isLoading}
                  loadingText="Loading"
                >
                  Send
                </Button>
              </ButtonGroup>
            </Flex>
          </Flex>
        </chakra.form>
      ) : (
        <chakra.form onSubmit={handleApiKeySubmit} h="100%" pb={2}>
          <FormControl>
            <FormLabel>
              <HStack>
                <CgInfo />
                <Text>
                  ChatCraft requires an{" "}
                  <Link
                    href="https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety"
                    textDecoration="underline"
                  >
                    OpenAI API Key
                  </Link>
                  {"."}
                </Text>
              </HStack>
            </FormLabel>
            <Flex>
              <Input
                flex="1"
                type="password"
                name="api-key"
                bg={useColorModeValue("white", "gray.700")}
                required
                autoFocus
              />
              <Button ml={2} type="submit">
                Save
              </Button>
            </Flex>
            <FormHelperText>
              Your API Key will be stored offline in your browser's{" "}
              <Link
                href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
                textDecoration="underline"
              >
                local storage
              </Link>
            </FormHelperText>
          </FormControl>
        </chakra.form>
      )}
    </Box>
  );
}

export default PromptForm;
