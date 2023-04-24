import { BaseChatMessage } from "langchain/schema";
import { Box, Collapse } from "@chakra-ui/react";

import Message from "./Message";

type MessagesViewProps = {
  messages: BaseChatMessage[];
  onRemoveMessage: (index: number) => void;
  singleMessageMode: boolean;
};

function MessageView({ messages, onRemoveMessage, singleMessageMode }: MessagesViewProps) {
  // When we're in singleMessageMode, we collapse all but the final message
  const lastMessage = messages.at(-1);

  return (
    <Box maxW="900px" mx="auto" scrollBehavior="smooth">
      <Collapse in={!singleMessageMode} animateOpacity>
        {messages.map((message: BaseChatMessage, index: number) => {
          return (
            <Message key={index} message={message} onDeleteClick={() => onRemoveMessage(index)} />
          );
        })}
      </Collapse>
      {singleMessageMode && lastMessage && (
        <Message
          message={lastMessage}
          onDeleteClick={() => onRemoveMessage(messages.indexOf(lastMessage))}
        />
      )}
    </Box>
  );
}

export default MessageView;
