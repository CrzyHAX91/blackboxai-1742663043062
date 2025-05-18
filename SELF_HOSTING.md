# Self-Hosting Guide

This guide explains how to set up your own cloud hosting for the Social Media Manager using Docker and Nginx.

## Prerequisites

1. A VPS (Virtual Private Server) with:
   - Ubuntu 20.04 or later
   - At least 1GB RAM
   - 20GB storage
   - Root access

2. A domain name pointing to your server's IP

3. Required software:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker and Docker Compose
   sudo apt install docker.io docker-compose -y

   # Start and enable Docker
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/social-media-manager.git
   cd social-media-manager
   ```

2. **Configure Domain**
   - Edit `docker-compose.yml`:
     - Replace `your@email.com` with your email
     - Replace `yourdomain.com` with your domain

   - Edit `nginx/conf.d/default.conf`:
     - Replace all instances of `yourdomain.com` with your domain

3. **Create Required Directories**
   ```bash
   mkdir -p nginx/ssl
   mkdir -p certbot/conf
   mkdir -p certbot/www
   ```

4. **Start the Services**
   ```bash
   # Start Nginx first
   docker-compose up -d nginx

   # Get SSL certificate
   docker-compose up certbot

   # Restart everything
   docker-compose down
   docker-compose up -d
   ```

## Security Considerations

1. **Firewall Setup**
   ```bash
   # Allow SSH, HTTP, and HTTPS
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443

   # Enable firewall
   sudo ufw enable
   ```

2. **SSL Auto-Renewal**
   ```bash
   # Create renewal script
   echo '#!/bin/bash
   docker-compose run certbot renew
   docker-compose restart nginx' > ssl-renew.sh

   # Make it executable
   chmod +x ssl-renew.sh

   # Add to crontab (runs twice daily)
   (crontab -l 2>/dev/null; echo "0 */12 * * * /path/to/ssl-renew.sh") | crontab -
   ```

## Monitoring

1. **View Logs**
   ```bash
   # All services
   docker-compose logs

   # Specific service
   docker-compose logs nginx
   ```

2. **Check Status**
   ```bash
   docker-compose ps
   ```

## Maintenance

1. **Updates**
   ```bash
   # Pull latest images
   docker-compose pull

   # Rebuild and restart
   docker-compose up -d --build
   ```

2. **Backup**
   ```bash
   # Backup certificates
   tar -czf backup-certs.tar.gz certbot/

   # Backup configuration
   tar -czf backup-config.tar.gz nginx/conf.d/
   ```

## Troubleshooting

1. **SSL Issues**
   - Check certificate status:
     ```bash
     docker-compose exec nginx nginx -t
     ```
   - Verify domain DNS:
     ```bash
     dig yourdomain.com
     ```

2. **Connection Issues**
   - Check Nginx status:
     ```bash
     docker-compose ps nginx
     ```
   - View Nginx logs:
     ```bash
     docker-compose logs nginx
     ```

## Performance Optimization

1. **Nginx Configuration**
   - Enable Gzip compression
   - Configure browser caching
   - Optimize SSL settings

2. **Docker Configuration**
   - Limit container resources
   - Use Docker volumes for persistence
   - Enable Docker logging rotation

## Cost Considerations

Estimated monthly costs for different VPS providers:

1. DigitalOcean:
   - Basic Droplet: $5-10/month
   - 1GB RAM, 25GB SSD

2. Linode:
   - Nanode: $5/month
   - 1GB RAM, 25GB SSD

3. Vultr:
   - Cloud Compute: $5/month
   - 1GB RAM, 25GB SSD

Additional costs:
- Domain name: ~$10-15/year
- SSL certificate: Free with Let's Encrypt
- Bandwidth: Usually included in VPS plan

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Docker and Nginx logs
3. Open an issue on GitHub

## Next Steps

After successful deployment:
1. Set up monitoring (e.g., UptimeRobot)
2. Configure backup automation
3. Implement CI/CD pipeline
4. Monitor resource usage

Remember to regularly:
- Update system packages
- Renew SSL certificates
- Monitor logs
- Backup data
