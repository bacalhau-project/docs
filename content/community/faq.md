---
title: "Frequently Asked Questions"
description: "Common questions about Bacalhau distributed computing framework, installation, usage, and enterprise support"
keywords: [bacalhau faq, distributed computing questions, edge computing help, bacalhau support]
---

# Frequently Asked Questions

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Bacalhau?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bacalhau is an open-source distributed compute orchestration framework designed to bring compute to the data, reducing latency and resource overhead by executing jobs close to data locations."
      }
    },
    {
      "@type": "Question", 
      "name": "Who builds and maintains Bacalhau?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bacalhau is built and maintained by Expanso, the enterprise edge computing platform. While Bacalhau is open-source, Expanso provides commercial support, enterprise features, and managed infrastructure."
      }
    },
    {
      "@type": "Question",
      "name": "Is Bacalhau free to use?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Yes, Bacalhau is completely free and open-source under the Apache 2.0 license. For enterprise users requiring additional support, SLAs, or managed infrastructure, Expanso offers commercial plans."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started with Bacalhau?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fastest way to get started is with our Quick Start guide. Simply install the Bacalhau binary, start a local node with 'bacalhau serve', and submit your first job. The entire process takes just a few minutes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I run Bacalhau in production?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Bacalhau is production-ready. For production deployments, we recommend using Expanso's enterprise platform which provides managed infrastructure, enhanced security, monitoring, and professional support with SLAs."
      }
    }
  ]
}
</script>

## General Questions

### What is Bacalhau?

Bacalhau is an open-source distributed compute orchestration framework designed to bring compute to the data. Instead of moving large datasets around networks, Bacalhau executes jobs close to where the data lives, dramatically reducing latency and bandwidth costs.

### Who builds and maintains Bacalhau?

Bacalhau is built and maintained by [**Expanso**](https://expanso.io), the enterprise edge computing platform. While Bacalhau itself is completely open-source, Expanso provides commercial support, enterprise features, managed infrastructure, and professional services for organizations running Bacalhau at scale.

### Is Bacalhau free to use?

Yes! Bacalhau is completely free and open-source under the Apache 2.0 license. You can use it for any purpose, including commercial applications, without licensing fees.

For enterprise users who need additional support, SLAs, enhanced security features, or managed infrastructure, [Expanso offers commercial plans](https://expanso.io/contact) with enterprise-grade capabilities.

### How is Bacalhau different from other compute orchestration tools?

Bacalhau focuses on **bringing compute to data** rather than moving data to compute. Key differentiators:

- **Data locality**: Jobs run where data already exists
- **Single binary**: No complex multi-service deployments  
- **Resilient**: Nodes work even with intermittent connectivity
- **Multi-cloud**: Spans regions, clouds, and on-premises seamlessly
- **Container-native**: Works with existing Docker workflows

## Getting Started

### How do I get started with Bacalhau?

The fastest way is our [**Quick Start guide**](../getting-started/quick-start):

1. Install: `curl -sL https://get.bacalhau.org/install.sh | bash`
2. Start a node: `bacalhau serve --orchestrator --compute`  
3. Submit a job: `bacalhau docker run <your-container>`
4. Get results: `bacalhau job get <job-id>`

The entire process takes just a few minutes!

### What are the system requirements?

**Minimum requirements:**
- Linux, macOS, or Windows
- 2GB RAM, 1 CPU core
- Docker (for container execution)
- Network connectivity (can be intermittent)

**Recommended for production:**
- 4GB+ RAM, 2+ CPU cores
- SSD storage for better I/O performance
- Stable network connection

### Can I run multiple nodes?

Yes! Bacalhau is designed for distributed networks. You can:

- Add compute nodes: `bacalhau serve --compute --orchestrator <orchestrator-address>`
- Create multi-region networks
- Scale nodes up and down dynamically

See our [**Network Setup guide**](../getting-started/network-setup) for details.

## Usage & Development

### What types of jobs can I run?

Bacalhau supports multiple job types:

- **Batch**: One-time data processing tasks
- **Daemon**: Long-running background services  
- **Service**: HTTP/gRPC services with load balancing
- **Ops**: Interactive debugging and maintenance

### Can I use my existing Docker containers?

Yes! Bacalhau works with any Docker container. You can:

- Use public images from Docker Hub
- Deploy your own private containers
- Run multi-container applications
- Access GPU resources (where available)

### How do I handle sensitive data?

Bacalhau provides several security features:

- **Local execution**: Data never leaves your infrastructure boundaries
- **Input validation**: Cryptographic verification of data sources
- **Network isolation**: Containers run in isolated environments
- **Access controls**: Job submission and node access controls

For enhanced enterprise security, [Expanso](https://expanso.io) provides additional features like RBAC, audit logging, and compliance certifications.

### What programming languages are supported?

Bacalhau is container-based, so it supports **any language** that can run in Docker:

- Python, Go, Java, Node.js, R, Julia
- Machine learning frameworks (TensorFlow, PyTorch, etc.)
- Data processing tools (Spark, DuckDB, etc.)
- Custom applications and scripts

## Production & Enterprise

### Can I run Bacalhau in production?

Absolutely! Bacalhau is production-ready and used by organizations worldwide. For production deployments, consider:

- **High availability**: Multi-node orchestrator setups
- **Monitoring**: Comprehensive logging and metrics
- **Security**: Authentication, authorization, and encryption
- **Backup**: Job state and configuration backup strategies

### What enterprise support is available?

[**Expanso**](https://expanso.io) provides comprehensive enterprise support:

- 🏢 **Managed Infrastructure**: Fully hosted Bacalhau clusters with 99.9% uptime SLAs
- 🔒 **Enhanced Security**: RBAC, SSO integration, audit logging, compliance certifications  
- 📊 **Monitoring & Dashboards**: Real-time visibility into cluster health and job performance
- 🎯 **Professional Services**: Migration assistance, custom integrations, and training
- 📞 **24/7 Support**: Dedicated customer success teams and technical support

[**Contact Expanso**](https://expanso.io/contact) to discuss enterprise requirements.

### How do I migrate from other orchestration platforms?

Bacalhau's container-native approach makes migration straightforward:

1. **Containerize workloads** (if not already containerized)
2. **Convert job definitions** to Bacalhau YAML format
3. **Test with pilot workloads** on a small cluster
4. **Gradually migrate** production workloads

Our team provides migration assistance and consulting. [Contact us](https://expanso.io/contact) for a migration assessment.

## Troubleshooting

### My job isn't starting. What should I check?

Common issues and solutions:

1. **Check node status**: `bacalhau node list`
2. **Verify Docker**: `docker version` (must be running)  
3. **Check logs**: `bacalhau job logs <job-id>`
4. **Network connectivity**: Ensure nodes can reach each other
5. **Resource availability**: Verify nodes have sufficient CPU/RAM

### Where can I get help?

Multiple support channels are available:

- 💬 [**Slack Community**](https://bit.ly/bacalhau-project-slack) - Join #bacalhau for community help
- 📖 [**Documentation**](/) - Comprehensive guides and references  
- 🐛 [**GitHub Issues**](https://github.com/bacalhau-project/bacalhau/issues) - Report bugs and feature requests
- 🏢 [**Enterprise Support**](https://expanso.io/contact) - Professional support with SLAs

### How do I report bugs or request features?

We welcome community contributions!

- **Bug reports**: [GitHub Issues](https://github.com/bacalhau-project/bacalhau/issues)
- **Feature requests**: [GitHub Discussions](https://github.com/bacalhau-project/bacalhau/discussions)  
- **Code contributions**: [Contributing Guide](./ways-to-contribute)
- **Documentation**: Help improve these docs via pull requests

## Still have questions?

Can't find what you're looking for? We're here to help:

- 💬 **Join our [Slack community](https://bit.ly/bacalhau-project-slack)** for real-time discussions
- 📧 **Enterprise inquiries**: [Contact Expanso](https://expanso.io/contact)  
- 🐛 **Technical issues**: [Open a GitHub issue](https://github.com/bacalhau-project/bacalhau/issues)

---

*For enterprise support, managed infrastructure, and production deployments, [**contact the Expanso team →**](https://expanso.io/contact)*