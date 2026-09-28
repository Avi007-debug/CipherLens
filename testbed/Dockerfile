FROM alpine:3.19

RUN apk update && apk add --no-cache \
    strongswan \
    iptables \
    iproute2 \
    tcpdump \
    bash \
    python3 \
    py3-pip \
    curl \
    iputils

WORKDIR /etc

# Default command starts strongswan charon daemon and keeps container alive
CMD ["/usr/sbin/ipsec", "start", "--nofork"]
