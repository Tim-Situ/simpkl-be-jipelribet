class BaseResponse {
    constructor(success = true, message = "success", data, error, metadata) {
        this.success = success
        this.message = message
        this.data = data
        this.error = error
        this.metadata = metadata
    }

}

module.exports = BaseResponse