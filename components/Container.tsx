import { ReactNode } from 'react';

interface IProps {
    children: ReactNode;
}

const Container = ({ children }: IProps) => {
    return (
        <div style={{
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            padding: '0 16px'
        }}>
            {children}
        </div>
    );
};

export default Container;