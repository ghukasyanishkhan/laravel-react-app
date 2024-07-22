import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
    const { links } = pagination;

    return (
        <div className="pagination">
            {links.map((link, index) => {
                const label = {__html: link.label}; // Parse HTML entities
                return (
                    <button
                        key={index}
                        onClick={() => onPageChange(link.url)}
                        disabled={link.url === null || link.active}
                        className={link.active ? "active" : ""}
                        dangerouslySetInnerHTML={label} // Set HTML content
                    />
                );
            })}
        </div>
    );
};

export default Pagination;
