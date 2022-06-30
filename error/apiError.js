class apiError extends Error {
	constructor(status, message) {
		super();
		this.status = status;
		this.message = message;
	}

	static badRequest(message) {
		return new apiError(404, message);
	}

	static internal(message) {
		return new apiError(500, message);
	}

	static forbidden(message) {
		return new apiError(403, message);
	}
}

module.exports = apiError;
