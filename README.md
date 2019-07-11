[![Build Status](https://travis-ci.org/cfn-modules/acm-certificate-public.svg?branch=master)](https://travis-ci.org/cfn-modules/acm-certificate-public)
[![NPM version](https://img.shields.io/npm/v/@cfn-modules/acm-certificate-public.svg)](https://www.npmjs.com/package/@cfn-modules/acm-certificate-public)

# cfn-modules: AWS Certificate Manager certificate (public)

Public certificate managed by ACM. Let's assume you have created a hosted zone for `widdix.net`. This module creates and validates a certificate for the following (sub)domain names:

* `widdix.net`
* `*.widdix.net`

> Keep in mind that `*.widdix.net` includes only one subdomain level. E.g. `www.widdix.net` is protected, but `www.test.widdix.net` is not.

## Install

> Install [Node.js and npm](https://nodejs.org/) first!

```
npm i @cfn-modules/acm-certificate-public
```

## Usage

```
---
AWSTemplateFormatVersion: '2010-09-09'
Description: 'cfn-modules example'
Resources:
  Certificate:
    Type: 'AWS::CloudFormation::Stack'
    Properties:
      Parameters:
        HostedZoneModule: !GetAtt 'HostedZone.Outputs.StackName' # required
      TemplateURL: './node_modules/@cfn-modules/acm-certificate-public/module.yml'
```

## Examples

none

## Related modules

* [route53-hosted-zone-private](https://github.com/cfn-modules/route53-hosted-zone-private)
* [route53-hosted-zone-public](https://github.com/cfn-modules/route53-hosted-zone-public)
* [route53-hosted-zone-wrapper](https://github.com/cfn-modules/route53-hosted-zone-wrapper)

## Parameters

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Default</th>
      <th>Required?</th>
      <th>Allowed values</th>
    </tr>
  </thead>
  <tbody>
     <tr>
      <td>HostedZoneModule</td>
      <td>Stack name of <a href="https://www.npmjs.com/search?q=keywords:cfn-modules:HostedZone">module implementing HostedZone</a></td>
      <td></td>
      <td>yes</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Outputs

## Outputs

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Interface</th>
      <th>Description</th>
      <th>Exported?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ModuleId</td>
      <td>global</td>
      <td>Id of the module</td>
      <td>no</td>
    </tr>
    <tr>
      <td>ModuleVersion</td>
      <td>global</td>
      <td>Version of the module</td>
      <td>no</td>
    </tr>
    <tr>
      <td>StackName</td>
      <td>global</td>
      <td>Name of the stack (used to pass module references)</td>
      <td>no</td>
    </tr>
    <tr>
      <td>Arn</td>
      <td>ExposeArn</td>
      <td>Certificate ARN</td>
      <td>yes</td>
    </tr>
  </tbody>
</table>

