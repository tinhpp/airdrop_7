import { Typography } from 'antd';
import clsx from 'clsx';
import { Fragment, useState } from 'react';

const { Paragraph, Text } = Typography;

export const Description = ({ children, rows = 4, moreSymbol = 'More', hideSymbol = 'Less', ...props }) => {
  const [counter, setCounter] = useState(0);
  const [ellipsis, setEllipsis] = useState(false);

  const onClose = () => {
    setEllipsis(false);
    setCounter((prev) => (!ellipsis ? prev + 0 : prev + 1));
  };

  const onExpand = () => {
    setEllipsis(true);
    setCounter((prev) => (!ellipsis ? prev + 0 : prev + 1));
  };

  const render = () => (
    <Fragment key={counter}>
      <Paragraph
        ellipsis={{
          rows,
          expandable: true,
          symbol: (
            <Text className="primary_blue" strong>
              {moreSymbol}
            </Text>
          ),
          onExpand,
        }}
        className={clsx('description', 'white-space-pre', props.className)}
        {...props}
      >
        {children}
        {ellipsis && (
          <a onClick={onClose} className="ant-typography-expand bold">
            {hideSymbol}
          </a>
        )}
      </Paragraph>
    </Fragment>
  );

  return <Fragment>{render()}</Fragment>;
};
