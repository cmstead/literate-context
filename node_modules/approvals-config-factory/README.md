# Approvals Config Factory #

Approvals.NodeJs is a great library for enabling you, the programmer, to simplify your tests.  That said, configuration requires copy/pasting every time you want to start up a new project.  After about the 4th time in as many days, I got tired of hunting down an old cofiguration to copy, so I made this.

Example:

```
    const approvalsLocation = './test/approvals';
    const approvalsConfigFactory = require('approvals-config-factory');

    const approvalsConfig = approvalsConfigFactory.buildApprovalsConfig({ 
        reporter: 'kdiff3'
    });

    require('approvals').configure(approvalsConfig).mocha(approvalsLocation);
```

## API: ##

- buildApprovalsConfig -- `approvalsOptions => approvalsConfig:object`,
    - Just pass in an object with a reporter and it will create a sane config
    - getApprovalsOptionsDefinition will give you the full rundown of all options
- getApprovalsOptionsDefinition: `() => approvalsOptionsDefinition:object`,
    - The object you get will tell you everything you need to know about the properties you can define
- getApprovalsReporterDefinition: `() => approvalsReporterDefinition:object`
    - Same behavior as getApprovalsOptionsDefinition
