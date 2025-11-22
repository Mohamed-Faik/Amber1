import React from "react";

const ListingSkeleton = () => {
	return (
		<div
			style={{
				position: "relative",
				width: "100%",
			}}
		>
			<div
				style={{
					position: "relative",
					width: "100%",
					backgroundColor: "#FFFFFF",
					borderRadius: "12px",
					overflow: "hidden",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
				}}
			>
				{/* Image Skeleton */}
				<div
					style={{
						position: "relative",
						width: "100%",
						paddingTop: "75%",
						overflow: "hidden",
						backgroundColor: "#f0f0f0",
					}}
					className="skeleton-shimmer"
				/>

				{/* Content Section */}
				<div style={{ padding: "16px" }}>
					{/* Badge Skeleton */}
					<div style={{ marginBottom: "8px" }}>
						<div
							style={{
								display: "inline-block",
								width: "80px",
								height: "24px",
								borderRadius: "6px",
								backgroundColor: "#f0f0f0",
							}}
							className="skeleton-shimmer"
						/>
					</div>

					{/* Price Skeleton */}
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "baseline",
							marginBottom: "12px",
						}}
					>
						<div
							style={{
								width: "100px",
								height: "24px",
								borderRadius: "4px",
								backgroundColor: "#f0f0f0",
							}}
							className="skeleton-shimmer"
						/>
					</div>

					{/* Location Skeleton */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "4px",
							marginBottom: "8px",
						}}
					>
						<div
							style={{
								width: "16px",
								height: "16px",
								borderRadius: "50%",
								backgroundColor: "#f0f0f0",
							}}
							className="skeleton-shimmer"
						/>
						<div
							style={{
								width: "120px",
								height: "16px",
								borderRadius: "4px",
								backgroundColor: "#f0f0f0",
							}}
							className="skeleton-shimmer"
						/>
					</div>

					{/* Title Skeleton */}
					<div
						style={{
							width: "100%",
							height: "20px",
							borderRadius: "4px",
							backgroundColor: "#f0f0f0",
							marginBottom: "8px",
						}}
						className="skeleton-shimmer"
					/>
					<div
						style={{
							width: "80%",
							height: "20px",
							borderRadius: "4px",
							backgroundColor: "#f0f0f0",
							marginBottom: "12px",
						}}
						className="skeleton-shimmer"
					/>

					{/* Category Badge Skeleton */}
					<div style={{ marginBottom: "12px" }}>
						<div
							style={{
								display: "inline-block",
								width: "100px",
								height: "28px",
								borderRadius: "6px",
								backgroundColor: "#f0f0f0",
							}}
							className="skeleton-shimmer"
						/>
					</div>

					{/* Property Details Skeleton */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "12px",
							flexWrap: "wrap",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<div
								style={{
									width: "14px",
									height: "14px",
									borderRadius: "2px",
									backgroundColor: "#f0f0f0",
								}}
								className="skeleton-shimmer"
							/>
							<div
								style={{
									width: "60px",
									height: "14px",
									borderRadius: "4px",
									backgroundColor: "#f0f0f0",
								}}
								className="skeleton-shimmer"
							/>
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<div
								style={{
									width: "14px",
									height: "14px",
									borderRadius: "2px",
									backgroundColor: "#f0f0f0",
								}}
								className="skeleton-shimmer"
							/>
							<div
								style={{
									width: "70px",
									height: "14px",
									borderRadius: "4px",
									backgroundColor: "#f0f0f0",
								}}
								className="skeleton-shimmer"
							/>
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<div
								style={{
									width: "14px",
									height: "14px",
									borderRadius: "2px",
									backgroundColor: "#f0f0f0",
								}}
								className="skeleton-shimmer"
							/>
							<div
								style={{
									width: "80px",
									height: "14px",
									borderRadius: "4px",
									backgroundColor: "#f0f0f0",
								}}
								className="skeleton-shimmer"
							/>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
};

export default ListingSkeleton;

