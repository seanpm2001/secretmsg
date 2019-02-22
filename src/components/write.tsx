import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { actions, SecretState, MsgPayload, MsgEnvelope } from "../store";
import { Wrapper } from "./wrapper";
import { EncryptInputs } from "./encrypt-inputs";
import { ShareOverlay } from "./share-overlay";

interface Props {
  saveMessage: (payload: MsgPayload) => void;
  clearMessage: () => void;
  envelope?: MsgEnvelope;
}

interface State {
  message: string;
  passphrase: string;
  expiration: number;
}

class WriteComp extends Component<Props, State> {
  state = {
    message: "",
    passphrase: "",
    expiration: 0
  };

  handleInput = (e: Event) => {
    if (e.target) {
      this.setState({ message: (e.target as HTMLFormElement).value });
    }
  };

  handlePassChange = (passphrase: string) => this.setState({ passphrase });

  handleExpireChange = (expiration: number) => this.setState({ expiration });

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.props.saveMessage({
      message: this.state.message,
      passphrase: this.state.passphrase,
      ttlHours: this.state.expiration
    });
  };

  handleClear = (e: Event) => {
    e.preventDefault();
    this.setState({ message: "", passphrase: "", expiration: 0 });
    this.props.clearMessage();
  };

  render() {
    const { envelope } = this.props;
    const { message, passphrase, expiration } = this.state;
    return (
      <Wrapper>
        <form onSubmit={this.handleSubmit}>
          <label class="msg-input-label" for="msg-input">
            {!envelope ? (
              "Message"
            ) : (
              <a href="/" onClick={this.handleClear}>
                &larr; Write new message
              </a>
            )}
          </label>
          <div class="write-group">
            <textarea
              autofocus
              disabled={!!envelope}
              id="msg-input"
              onInput={this.handleInput}
              rows={10}
              value={envelope ? envelope.encrypted : message}
            />
          </div>
          {!envelope ? (
            <EncryptInputs
              passphrase={passphrase}
              expiration={expiration}
              onPassChange={this.handlePassChange}
              onExpireChange={this.handleExpireChange}
            />
          ) : (
            <ShareOverlay id={envelope.id} />
          )}
        </form>
      </Wrapper>
    );
  }
}

export const Write = connect<{}, State, SecretState, Props>(
  ["envelope"],
  actions
)(WriteComp);
