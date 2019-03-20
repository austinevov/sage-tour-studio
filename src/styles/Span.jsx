import styled, { css } from 'styled-components';
import { space, width, fontSize, color, lineHeight } from 'styled-system';

const Span = styled.span`
  font-family: 'Spectral';
  ${lineHeight}
  ${space};
  ${width};
  ${fontSize};
  ${color};
  ${props =>
    props.gr &&
    css`
      grid-row: ${props.gr};
    `}
  ${props =>
    props.gc &&
    css`
      grid-column: ${props.gc};
    `};
  ${props =>
    props.italics &&
    css`
      font-style: italic;
    `};
  ${props =>
    props.underline &&
    css`
      text-decoration: underline;
    `};
`;

const Note = styled(Span)`
  font-size: 12px;
  font-style: italic;
  font-weight: 300;
  color: #3b4056;
  padding: 0;
  margin: 0;
  display: block;
`;

export { Span, Note };
