import React, { useState, useEffect, useRef } from "react";

const SearchBar = () => {
    // Debounce search handler
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchKeyword(value);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        setIsSearching(true);
        searchDebounceRef.current = setTimeout(async () => {
            try {
                const res = await productServices.getProducts(1, 8, value);
                const data = res.data?.items ?? [];
                setProducts(data);
                setTotalProducts(res.data?.totalElements ?? res.data?.totalItem ?? data.length);
                if (pageNumber !== 1) setPageNumber(1);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }, 400);
    };
    const handleClearSearch = () => {
        setSearchKeyword("");
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        loadProducts("");
    };
    return (
        <>
            {/* ===== SEARCH BAR ===== */}
            <div className="mb-4">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#f8fafc",
                        border: `2px solid ${searchKeyword ? "#3b82f6" : "#e2e8f0"}`,
                        borderRadius: "14px",
                        padding: "0 12px",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxShadow: searchKeyword ? "0 0 0 3px rgba(59,130,246,0.10)" : "none",
                    }}
                >
                    {/* Icon */}
                    <span style={{ color: searchKeyword ? "#3b82f6" : "#94a3b8", display: "flex", flexShrink: 0, transition: "color 0.2s" }}>
                        {isSearching ? (
                            <Loader2 size={17} style={{ animation: "spin 0.7s linear infinite" }} />
                        ) : (
                            <Search size={17} />
                        )}
                    </span>

                    {/* Input */}
                    <input
                        id="admin-product-search"
                        type="text"
                        value={searchKeyword}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => e.key === "Escape" && handleClearSearch()}
                        placeholder="Tìm tên sản phẩm..."
                        autoComplete="off"
                        style={{
                            flex: 1,
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            padding: "11px 4px",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#1e293b",
                        }}
                    />

                    {/* Badge số kết quả */}
                    {searchKeyword && !isSearching && (
                        <span
                            style={{
                                background: "#3b82f6",
                                color: "#fff",
                                fontSize: "11px",
                                fontWeight: 700,
                                borderRadius: "999px",
                                padding: "2px 8px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            {totalProducts} kết quả
                        </span>
                    )}

                    {/* Clear button */}
                    {searchKeyword && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            title="Xóa tìm kiếm"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                border: "none",
                                background: "#e2e8f0",
                                color: "#64748b",
                                cursor: "pointer",
                                flexShrink: 0,
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Hint text khi đang search */}
                {searchKeyword && !isSearching && (
                    <p style={{ marginTop: "6px", fontSize: "12px", color: "#94a3b8", paddingLeft: "2px" }}>
                        Kết quả cho <span style={{ color: "#3b82f6", fontWeight: 700 }}>&ldquo;{searchKeyword}&rdquo;</span>
                        {" "}— nhấn <kbd style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "1px 4px", fontSize: "11px", fontFamily: "monospace" }}>Esc</kbd> để xóa
                    </p>
                )}
            </div>
            {/* ===== END SEARCH BAR ===== */}
        </>
    );
};

export default SearchBar;
